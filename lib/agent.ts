export async function processMessage(message: string, fromAddress: string) {

  // Step 1 — parse the message
  const parseResponse = await fetch("/api/agent/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, fromAddress })
  })
  const { intent } = await parseResponse.json()

  // Step 2 — generate routes from parsed intent
  const routesResponse = await fetch("/api/routes/generate", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(intent)
  })
  const { type, routes } = await routesResponse.json()

  return { type, routes, intent }
}