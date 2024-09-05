import express from 'express';
import expressLayouts from 'express-ejs-layouts';  // Importar o express-ejs-layouts

const router = express.Router();

// Usar express-ejs-layouts para aplicar o layout nas rotas do frontend
router.use(expressLayouts);

// Página de inscrição em uma campanha (/c/:slug)
router.get('/c/:slug', (req, res) => {
  const { slug } = req.params;
  res.render('pages/campaign', { layout: 'layouts/layout', title: `Inscreva-se na campanha ${slug}` });
});

// Página para pegar o link de convite (/c/:slug/invite)
router.get('/c/:slug/invite', (req, res) => {
  const { slug } = req.params;
  res.render('pages/invite', { layout: 'layouts/layout', title: `Convide seus amigos para a campanha ${slug}` });
});

export default router;
