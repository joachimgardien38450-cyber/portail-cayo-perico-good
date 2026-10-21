exports.handler = async function () {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = 'appLNpXCvj4QCvPPv';
  const tableName = 'Services publics';

  if (!token) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'AIRTABLE_TOKEN is not configured.' }) };
  }

  const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
  url.searchParams.set('pageSize', '100');

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    const body = await response.json();
    if (!response.ok) {
      console.error('Airtable request failed:', response.status, body.error?.type || 'unknown error');
      return { statusCode: 502, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Unable to load Airtable records.' }) };
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ records: body.records || [] })
    };
  } catch (error) {
    console.error('Airtable fetch failed:', error.message);
    return { statusCode: 502, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Airtable connection failed.' }) };
  }
};
