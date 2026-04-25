export function parseQuickInput(text: string) {
  // Implementation for parsing quick input
  // 1k => 1000; 1m => 1000000; 1.5k => 1500
  // 1000 => 1000; 1,000 => 1000; 1.000 => 1000
  const amountRegex = /([\d.,]+)([kKmM]?)/;
  const match = text.match(amountRegex);
  let amount = 0;
  if (match) {
    const numPart = match[1].replace(/[,\.]/g, ''); // Remove commas and dots
    const suffix = match[2].toLowerCase();
    amount = parseFloat(numPart);
    if (suffix === 'k') {
      amount *= 1000;
    } else if (suffix === 'm') {
      amount *= 1000000;
    }
  }
  const title = text.replace(amountRegex, '').trim();
  return { title, amount };
}
