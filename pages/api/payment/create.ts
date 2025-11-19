// This API route is deprecated. The active payment creation endpoint is at /api/create-payment.
// This placeholder is here to prevent build errors from a misconfigured file path.
export default async function handler(req, res) {
  res.setHeader('Allow', []);
  return res.status(404).json({ error: 'This endpoint is deprecated. Use /api/create-payment instead.' });
}
