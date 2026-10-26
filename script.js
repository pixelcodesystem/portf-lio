// Contato público da Pixel Code. Nenhuma senha ou chave de e-mail é necessária.
const CONTACT = { whatsapp: '', email: 'pixelc.contato@gmail.com' };
const byId = id => document.getElementById(id);
byId('year').textContent = new Date().getFullYear();
const direct = byId('direct-contact');
if (/^\d{12,13}$/.test(CONTACT.whatsapp)) {
  direct.href = `https://wa.me/${CONTACT.whatsapp}`;
  direct.target = '_blank'; direct.rel = 'noopener'; direct.hidden = false;
  byId('contact-note').textContent = 'Prefere conversar diretamente? Fale com a Pixel Code pelo WhatsApp.';
} else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email)) {
  direct.href = `mailto:${CONTACT.email}`; direct.hidden = false;
  byId('contact-note').textContent = 'Prefere enviar pelo seu aplicativo de e-mail? Escreva para a Pixel Code.';
}
document.querySelectorAll('[data-kind]').forEach(link => link.addEventListener('click', () => {
  byId('kind').value = link.dataset.kind;
}));
const form = byId('brief-form');
const sendButton = byId('send-brief');
const feedback = byId('status');
let sending = false;
function showFeedback(message, state) {
  feedback.textContent = message;
  feedback.dataset.state = state;
  feedback.focus({ preventScroll: true });
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  if (!form.reportValidity()) return;
  const name = byId('name').value.trim();
  const email = byId('email').value.trim();
  const message = byId('idea').value.trim();
  if (name.length < 2 || message.length < 15) {
    showFeedback('Informe seu nome e descreva a ideia com pelo menos 15 caracteres.', 'error');
    return;
  }
  if (byId('website').value) return;
  if (!['https:', 'http:'].includes(window.location.protocol)) {
    showFeedback('Abra o site publicado para enviar sua mensagem. Se preferir, escreva para pixelc.contato@gmail.com.', 'error');
    return;
  }
  sending = true;
  sendButton.disabled = true;
  sendButton.textContent = 'Enviando…';
  form.setAttribute('aria-busy', 'true');
  showFeedback('Enviando sua mensagem…', 'pending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        name,
        email,
        business: byId('business').value.trim() || 'Não informado',
        kind: byId('kind').value,
        message,
        _subject: 'Novo projeto — Portfólio Pixel Code',
        _template: 'table',
        _captcha: 'false',
        _honey: '',
        _url: window.location.href.split('#')[0]
      })
    });
    const result = await response.json();
    const serviceMessage = String(result.message || '');
    if (/activat|ativa[çc][aã]o|ativad/i.test(serviceMessage) && !/successfully activated/i.test(serviceMessage)) {
      showFeedback('O formulário ainda está sendo habilitado. Envie sua mensagem diretamente para pixelc.contato@gmail.com.', 'error');
      return;
    }
    if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('submission_failed');
    form.reset();
    showFeedback('Mensagem enviada! Obrigado pelo contato. A Pixel Code responderá pelo e-mail informado.', 'success');
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'O envio demorou mais que o esperado e não foi possível confirmar o resultado. Tente novamente mais tarde ou escreva para pixelc.contato@gmail.com.'
      : 'Não foi possível confirmar o envio. Seus dados continuam preenchidos. Tente novamente ou escreva para pixelc.contato@gmail.com.';
    showFeedback(message, 'error');
  } finally {
    clearTimeout(timeout);
    sending = false;
    sendButton.disabled = false;
    sendButton.textContent = 'Enviar meu projeto ↗';
    form.removeAttribute('aria-busy');
  }
});
