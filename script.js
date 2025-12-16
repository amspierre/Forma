let currentStep = 1;
    const totalSteps = 7;
    const curriculumData = {};

    function updateStepDisplay() {
        document.querySelectorAll('.step-pill').forEach((pill, index) => {
            const stepNum = index + 1;
            pill.classList.remove('completed', 'current', 'incomplete');

            if (stepNum < currentStep) {
                pill.classList.add('completed');
            } else if (stepNum === currentStep) {
                pill.classList.add('current');
            } else {
                pill.classList.add('incomplete');
            }
        });

        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });

        document
            .querySelector(`.step-content[data-step="${currentStep}"]`)
            .classList.add('active');

        document.getElementById('btnVoltar').style.display =
            currentStep === 1 ? 'none' : 'block';

        const btnProximo = document.getElementById('btnProximo');

        if (currentStep === totalSteps) {
            btnProximo.textContent = 'Concluir';
            btnProximo.classList.remove('btn-primary-custom');
            btnProximo.classList.add('btn-success');
            showResumo();
        } else {
            btnProximo.textContent = 'Próximo Passo';
            btnProximo.classList.remove('btn-success');
            btnProximo.classList.add('btn-primary-custom');
        }

        document.getElementById('curriculum').scrollIntoView({
            behavior: 'smooth'
        });
    }

    function saveCurrentStepData() {
        const form = document.getElementById(`form-step-${currentStep}`);
        if (!form) return;

        form.querySelectorAll('input, textarea, select').forEach(input => {
            curriculumData[input.id] =
                input.type === 'checkbox' ? input.checked : input.value;
        });
    }

    function goToNextStep() {
        if (currentStep === totalSteps) {
            alert('Currículo concluído com sucesso!');
            return;
        }
        saveCurrentStepData();
        currentStep++;
        updateStepDisplay();
    }

    function goToPreviousStep() {
        saveCurrentStepData();
        currentStep--;
        updateStepDisplay();
    }

    function showResumo() {
        const resumo = document.getElementById('dadosResumo');

        resumo.innerHTML = `
            <div class="card mb-3">
                <div class="card-header bg-success text-white">Dados Principais</div>
                <div class="card-body">
                    <p><strong>Nome:</strong> ${curriculumData.nomeCompleto || '-'}</p>
                    <p><strong>Cidade:</strong> ${curriculumData.cidade || '-'}</p>
                    <p><strong>Cargo:</strong> ${curriculumData.cargo || '-'}</p>
                    <p><strong>Email:</strong> ${curriculumData.email || '-'}</p>
                    <p><strong>Telefone:</strong> ${curriculumData.telefone || '-'}</p>
                </div>
            </div>

            <div class="card mb-3">
                <div class="card-header bg-success text-white">Resumo Profissional</div>
                <div class="card-body">
                    <p>${curriculumData.resumoProfissional || '-'}</p>
                </div>
            </div>
        `;
    }

    updateStepDisplay();