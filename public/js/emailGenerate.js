const form = document.querySelector('form');
const canvasAI = document.querySelector('.ai-generated');

// Main form
form.addEventListener('submit', () => {
  const el = document.querySelector('.el').value;
  const prompt = document.querySelector('.prompt').value;

  if (el === 'image') {
    generateImage(prompt);
  } else {
    generateCode(prompt);
  }
});

// Code
async function generateCode(prompt) {
  const response = await fetch('/ai/completion', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "prompt": prompt
    })
  });
  const data = await response.json();
  
  canvasAI.innerHTML = data.completion;
  generateScripts(data.script);
  preventForms();
}

// Images
async function generateImage(prompt) {
  const response = await fetch('/ai/generateimage', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();

  canvasAI.innerHTML = `
  <img style="width:512px;" src="${data.image}" alt="AI Generated Image">
  `;
}

// Edits
const makeEditForm = document.querySelector('.make-edit-form');
makeEditForm.addEventListener('submit', () => {
  const canvas = canvasAI.innerHTML;
  const aiScript = document.querySelector('script.aiScript').textContent;
  const el = canvas + aiScript;
  const prompt = document.querySelector('.edit-description').value;
  generateEdit(el, prompt);
});

async function generateEdit(el, prompt) {
  const response = await fetch('/ai/edit', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "el": el,
      "prompt": prompt
    })
  });
  const data = await response.json();

  canvasAI.innerHTML = data.completion;
  generateScripts(data.script);
  preventForms();
}

function generateScripts(script) {
  if (script) {
    const exisitingScript = document.querySelector('.aiScript');
    if (exisitingScript) {
      exisitingScript.remove();
    }
    const newScript = document.createElement('script');
    newScript.textContent = script;
    newScript.classList.add('aiScript');
    document.querySelector('body').appendChild(newScript);
  }
}

function preventForms() {
  const allForms = document.querySelectorAll('form');

  allForms.forEach( forms => {
    forms.addEventListener('submit', e => {
      e.preventDefault();
    });
  });
}
preventForms();