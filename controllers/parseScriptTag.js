function parseScriptTag(response) {
  let startRecord = false;
  let responseHTML = '';
  let scriptTag = '';

  for (let i = 0; i < response.length; i++) {
    if (!startRecord) {
      responseHTML += response[i];
      if (response[i] === '<') {
        let tagBuffer = '';
        for (let j = 0; j < 8; j++) {
          tagBuffer += response[i + j];
        }
        if (tagBuffer === '<script>') {
          startRecord = true;
          responseHTML = responseHTML.slice(0,-1);
          scriptTag += response[i];
        } else {
          tagBuffer = '';
        }
      }
    } else {
      scriptTag += response[i];
    }
  }

  const script = tagParse(scriptTag);
  return { responseHTML, script }
}

function tagParse(script) {
  let parsedJS = ''
  for (let i = 8; i < (script.length - 9); i++) {
    parsedJS += script[i];
  }
  return parsedJS;
}

module.exports = { parseScriptTag };