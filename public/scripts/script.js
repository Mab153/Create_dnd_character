const form = document.getElementById('characterForm');
const skillInput = document.getElementById('charSkills');
const addSkillBtn = document.getElementById('addSkillBtn');
const tagsWrapper = document.getElementById('tagsWrapper');

let skillsArray = [];

function renderTags() {
  tagsWrapper.innerHTML = ''; 
  skillsArray.forEach((skill, index) => {
    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.innerHTML = `${skill} <span class="tag-remove" data-index="${index}">&times;</span>`;
    tagsWrapper.appendChild(tag);
  });
}

function addSkill() {
  const value = skillInput.value.trim();
  if (value && !skillsArray.includes(value)) {
    skillsArray.push(value);
    renderTags();
    skillInput.value = ''; 
  }
}

if (addSkillBtn) addSkillBtn.addEventListener('click', addSkill);

if (skillInput) {
  skillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addSkill();
    }
  });
}

if (tagsWrapper) {
  tagsWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-remove')) {
      const indexToRemove = e.target.getAttribute('data-index');
      skillsArray.splice(indexToRemove, 1); 
      renderTags(); 
    }
  });
}

// ОТПРАВКА С ФИКСАЦИЕЙ ОШИБОК
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  
  console.log("--> Нажата кнопка отправки формы!"); // ЛОГ 1

  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);
  formProps.skills = skillsArray; 

  const jsonPayload = JSON.stringify(formProps);
  console.log("--> Сформированные данные для Flask:", jsonPayload); // ЛОГ 2

  try {
    console.log("--> Пытаемся достучаться до Flask..."); // ЛОГ 3
    const response = await fetch('http://127.0.0.1:5000/hero_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonPayload
    });

    console.log("--> Flask ответил со статусом:", response.status); // ЛОГ 4

    if (response.ok) {
      const responseData = await response.json();
      console.log("--> Ответ сервера:", responseData);
      alert('Персонаж успешно сохранен на сервере!');
      form.reset();
      skillsArray = []; 
      renderTags();     
    } else {
      alert('Ошибка ответа сервера: ' + response.status);
    }
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА FETCH:', error); // СЮДА ПОПАДЕТ CORS ИЛИ ОТКЛЮЧЕННЫЙ СЕРВЕР
    alert('Не удалось связаться с сервером. Посмотрите вкладку Console в браузере.');
  }
});
