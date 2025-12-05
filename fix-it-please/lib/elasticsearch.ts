import { Client } from '@elastic/elasticsearch';

const ELASTIC_CLOUD_ID = process.env.ELASTIC_CLOUD_ID;
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;

if (!ELASTIC_CLOUD_ID || !ELASTIC_API_KEY) {
  console.warn("Missing Elasticsearch environment variables");
}

const client = new Client({
  cloud: { id: ELASTIC_CLOUD_ID || "" },
  auth: { apiKey: ELASTIC_API_KEY || "" }
});

export default client;