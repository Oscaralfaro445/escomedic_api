const { GpcIndex, GpcConditionCode } = require("../models");
const { expandCandidates } = require("./expandCie10Code");

async function resolveGpc(candidateCodes) {
  const expandedCodes = expandCandidates(candidateCodes);

  const matches = await GpcConditionCode.findAll({
    where: { cie10_code: expandedCodes },
    include: [{ model: GpcIndex, where: { is_active: true }, required: true }],
  });

  if (matches.length === 0) {
    return { gpc: null, ambiguous: false, matchedCodes: [] };
  }

  // Agrupamos coincidencias por gpc_index_id
  const scoreByGpc = new Map();

  for (const match of matches) {
    const gpcId = match.gpc_id;
    if (!scoreByGpc.has(gpcId)) {
      scoreByGpc.set(gpcId, {
        gpc: match.gpc_index,
        count: 0,
        hasPrimary: false,
        matchesCodes: [],
      });
    }
    const entry = scoreByGpc.get(gpcId);
    entry.count += 1;
    entry.matchesCodes.push(match.cie10_code);
    if (match.is_primary) entry.hasPrimary = true;
  }

  const candidates = Array.from(scoreByGpc.values());
  const maxCount = Math.max(...candidates.map((candidate) => candidate.count));
  const topCandidates = candidates.filter(
    (candidate) => candidate.count === maxCount,
  );

  if (topCandidates.length === 1) {
    return {
      gpc: topCandidates[0].gpc,
      ambiguous: false,
      matchedCodes: topCandidates[0].matchesCodes,
    };
  }

  // Empate
  const primaryWinners = topCandidates.filter(
    (candidate) => candidate.hasPrimary,
  );
  if (primaryWinners.length === 1) {
    return {
      gpc: primaryWinners[0].gpc,
      ambiguous: false,
      matchedCodes: primaryWinners[0].matchesCodes,
    };
  }

  // Sigue empatado
  const sorted = topCandidates.sort((a, b) => {
    const dateA = a.gpc.last_processed
      ? new Date(a.gpc.last_processed).getTime()
      : 0;
    const dateB = b.gpc.last_processed
      ? new Date(b.gpc.last_processed).getTime()
      : 0;
    return dateB - dateA; // Orden descendente
  });

  return {
    gpc: sorted[0].gpc,
    ambiguous: true,
    matchedCodes: sorted[0].matchesCodes,
  };
}

module.exports = resolveGpc;
