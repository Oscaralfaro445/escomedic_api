function expandCie10Code(code) {
  const expanded = new Set([code]);

  const dotIndex = code.indexOf(".");
  if (dotIndex !== -1) {
    expanded.add(code.substring(0, dotIndex));
  }

  return Array.from(expanded);
}

function expandCandidates(codes) {
  const expanded = new Set();
  codes.forEach((code) => {
    expandCie10Code(code).forEach((code) => expanded.add(code));
  });
  return Array.from(expanded);
}

module.exports = { expandCie10Code, expandCandidates };
