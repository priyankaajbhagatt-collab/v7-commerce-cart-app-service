import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/healthz', async () => ({ status: 'ok' }));

app.get('/', async () => ({
  service: 'v7-commerce-cart-app-service',
  description: 'v7 commerce-cart-app-service',
  product: 'commerce-cart',
  domain: 'cart',
}));

const port = Number(process.env.PORT ?? 3000);

app.listen({ port, host: '0.0.0.0' }).catch(err => {
  app.log.error(err);
  process.exit(1);
});
