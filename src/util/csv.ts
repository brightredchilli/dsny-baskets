
/// Given a url of a csv with a header, parse the url and return an array of objects
export async function csvParse(url: string): Promise<any[]> {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split('\n');

  const headers = lines[0].split(',');

  const arr = []
  for (let i = 1; i < lines.length; i++) {

    const row = lines[i].split(',');
    if (row.length !== headers.length) continue;

    // make sure CSV header names line up with DSNYBasket type
    const obj = Object.fromEntries(
      headers.map((h, j) => [h.trim(), row[j]?.trim()])
    )

    arr.push(obj)
  }
  return arr
}
