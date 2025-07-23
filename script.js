document.addEventListener('DOMContentLoaded', function() {
    let teamMembers = extractExistingMembers();
    const MAX_MEMBERS = 4;
    
    // Eliminar las tarjetas estáticas originales
    document.querySelectorAll('.table-container').forEach(container => {
        container.remove();
    });
    // Elementos del DOM
    const tableContainer = document.querySelector('body');
    const addMemberBtn = document.createElement('button');
    addMemberBtn.id = 'add-member';
    addMemberBtn.textContent = '➕ Agregar Miembro';
    document.body.appendChild(addMemberBtn);

    // Formulario flotante
    const memberForm = createMemberForm();
    document.body.appendChild(memberForm);
    memberForm.style.display = 'none';

    renderTeam();

    addMemberBtn.addEventListener('click', showForm);
    document.getElementById('save-member').addEventListener('click', saveMember);
    document.getElementById('cancel-add').addEventListener('click', hideForm);
    tableContainer.addEventListener('click', handleCardActions);

    // Funciones principales
    function createMemberForm() {
        const form = document.createElement('div');
        form.id = 'member-form';
        form.innerHTML = `
            <h3>Agregar/Editar Miembro</h3>
            <input type="text" id="member-name" placeholder="Nombre" required>
            <input type="text" id="member-position" placeholder="Cargo" required>
            <input type="text" id="member-role" placeholder="Rol" required>
            <textarea id="member-description" placeholder="Descripción" required></textarea>
            <input type="text" id="member-contact" placeholder="Enlace de contacto" required>
            <input type="text" id="member-skills" placeholder="Habilidades" required>
            <input type="text" id="member-image" placeholder="URL de imagen">
            <input type="hidden" id="member-index" value="-1">
            <button id="save-member">💾 Guardar</button>
            <button id="cancel-add">❌ Cancelar</button>
        `;
        return form;
    }

    function renderTeam() {
        // Limpiar contenedor (excepto el botón y formulario)
        const elementsToKeep = ['add-member', 'member-form'];
        Array.from(tableContainer.children).forEach(child => {
            if (!elementsToKeep.includes(child.id)) {
                tableContainer.removeChild(child);
            }
        });

        // Crear tarjetas para cada miembro
        teamMembers.forEach((member, index) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'table-container';
            
            cardWrapper.innerHTML = `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${member.image || 'ico/'}" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>Cargo: ${member.position}</p>
                            <p>Rol: ${member.role}</p>
                        </div>
                        <div class="flip-card-back">
                            <h4>Integrante ${index + 1}</h4>
                            <p>Contacto: <a href="${member.contact}" target="_blank">★Enlace★</a></p>
                            <p>Habilidades: ${member.skills}</p>
                            <p>Descripción: ${member.description}</p>
                            <button class="edit-member" data-index="${index}">✏️ Editar</button>
                            <button class="delete-member" data-index="${index}">🗑️ Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            
            tableContainer.insertBefore(cardWrapper, addMemberBtn);
        });
    }

    function showForm() {
        if (teamMembers.length >= MAX_MEMBERS) {
            alert(`Solo puedes tener ${MAX_MEMBERS} miembros en el equipo.`);
            return;
        }
        document.getElementById('member-index').value = '-1'; // -1 = nuevo miembro
        resetForm();
        memberForm.style.display = 'block';
    }

    function hideForm() {
        memberForm.style.display = 'none';
    }

    function resetForm() {
        document.getElementById('member-name').value = '';
        document.getElementById('member-position').value = '';
        document.getElementById('member-role').value = '';
        document.getElementById('member-description').value = '';
        document.getElementById('member-contact').value = '';
        document.getElementById('member-skills').value = '';
        document.getElementById('member-image').value = '';
    }

    function saveMember() {
        const index = parseInt(document.getElementById('member-index').value);
        const memberData = {
            name: document.getElementById('member-name').value,
            position: document.getElementById('member-position').value,
            role: document.getElementById('member-role').value,
            description: document.getElementById('member-description').value,
            contact: document.getElementById('member-contact').value,
            skills: document.getElementById('member-skills').value,
            image: document.getElementById('member-image').value
        };

        // Validación básica
        if (!memberData.name || !memberData.position || !memberData.role) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        if (index === -1) {
            // Nuevo miembro
            teamMembers.push(memberData);
        } else {
            // Editar miembro existente
            teamMembers[index] = memberData;
        }

        renderTeam();
        hideForm();
    }

    function handleCardActions(e) {
        if (e.target.classList.contains('delete-member')) {
            const index = e.target.getAttribute('data-index');
            if (confirm('¿Eliminar este miembro?')) {
                teamMembers.splice(index, 1);
                renderTeam();
            }
        }
        
        if (e.target.classList.contains('edit-member')) {
            const index = e.target.getAttribute('data-index');
            const member = teamMembers[index];
            
            document.getElementById('member-index').value = index;
            document.getElementById('member-name').value = member.name;
            document.getElementById('member-position').value = member.position;
            document.getElementById('member-role').value = member.role;
            document.getElementById('member-description').value = member.description;
            document.getElementById('member-contact').value = member.contact;
            document.getElementById('member-skills').value = member.skills;
            document.getElementById('member-image').value = member.image || '';
            
            memberForm.style.display = 'block';
        }
    }
});


function extractExistingMembers() {
    const members = [];
    const cards = document.querySelectorAll('.flip-card');
    
    cards.forEach(card => {
        const front = card.querySelector('.flip-card-front');
        const back = card.querySelector('.flip-card-back');
        
        members.push({
            name: front.querySelector('h3').textContent,
            position: front.querySelector('p:nth-of-type(1)').textContent.replace('Cargo: ', ''),
            role: front.querySelector('p:nth-of-type(2)').textContent.replace('Rol: ', ''),
            contact: back.querySelector('a') ? back.querySelector('a').href : '',
            skills: back.querySelector('p:nth-of-type(2)').textContent.replace('Habilidades: ', ''),
            description: back.querySelector('p:nth-of-type(3)').textContent.replace('Descripción: ', ''),
            image: front.querySelector('img') ? front.querySelector('img').src : ''
        });
    });
    
    return members;
}

