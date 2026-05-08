export async function fetchAuthors() {
  const res = await fetch(
    "https://fakerestapi.azurewebsites.net/api/v1/Authors"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }

  return res.json();
}