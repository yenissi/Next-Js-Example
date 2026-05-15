export async function fetchActivities() {
  const res = await fetch(
    "https://fakerestapi.azurewebsites.net/api/v1/Activities"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch activities");
  }

  return res.json();
}