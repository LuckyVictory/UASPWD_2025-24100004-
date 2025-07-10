document.querySelectorAll('.select-tutor').forEach(button => {
  button.addEventListener('click', (e) => {
    const tutorName = e.target.closest('.tutor-card').dataset.name;
    document.getElementById('tutorInput').value = tutorName;
    document.getElementById('tutorInput').focus();
  });
});

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new URLSearchParams(new FormData(form));

  const response = await fetch('/contact', {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const text = await response.text();
  document.getElementById('responseMsg').textContent = text;
  form.reset();
});
