let currentStep = 1;
const totalSteps = 7;
const curriculumData = {};

function updateStepDisplay() {
  document.querySelectorAll(".step-pill").forEach((pill, index) => {
    const stepNum = index + 1;
    pill.classList.remove("completed", "current", "incomplete");

    if (stepNum < currentStep) {
      pill.classList.add("completed");
    } else if (stepNum === currentStep) {
      pill.classList.add("current");
    } else {
      pill.classList.add("incomplete");
    }
  });

  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.remove("active");
  });

  document
    .querySelector(`.step-content[data-step="${currentStep}"]`)
    .classList.add("active");

  document.getElementById("btnVoltar").style.display =
    currentStep === 1 ? "none" : "inline-block";

  const btnProximo = document.getElementById("btnProximo");
  const btnConcluir = document.getElementById("btnConcluir");

  if (currentStep === totalSteps) {
    btnProximo.classList.add("d-none");
    btnConcluir.classList.remove("d-none");
    showResumo();
  } else {
    btnProximo.classList.remove("d-none");
    btnConcluir.classList.add("d-none");
  }

  document.getElementById("curriculum").scrollIntoView({
    behavior: "smooth",
  });
}

function saveCurrentStepData() {
  const form = document.getElementById(`form-step-${currentStep}`);
  if (!form) return;

  form.querySelectorAll("input, textarea, select").forEach((input) => {
    curriculumData[input.id] =
      input.type === "checkbox" ? input.checked : input.value;
  });
}

function goToNextStep() {
  if (currentStep === totalSteps) {
    alert("Currículo concluído com sucesso!");
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
  const resumo = document.getElementById("dadosResumo");

  resumo.innerHTML = `
            <div class="card mb-3">
                <div class="card-header bg-success text-white">Dados Principais</div>
                <div class="card-body">
                    <p><strong>Nome:</strong> ${
                      curriculumData.nomeCompleto || "-"
                    }</p>
                    <p><strong>Cidade:</strong> ${
                      curriculumData.cidade || "-"
                    }</p>
                    <p><strong>Cargo:</strong> ${
                      curriculumData.cargo || "-"
                    }</p>
                    <p><strong>Email:</strong> ${
                      curriculumData.email || "-"
                    }</p>
                    <p><strong>Telefone:</strong> ${
                      curriculumData.telefone || "-"
                    }</p>
                </div>
            </div>

            <div class="card mb-3">
                <div class="card-header bg-success text-white">Resumo Profissional</div>
                <div class="card-body">
                    <p>${curriculumData.resumoProfissional || "-"}</p>
                </div>
            </div>
        `;
}

updateStepDisplay();

function concluirCurriculo() {
  saveCurrentStepData();

  document.getElementById("pdf-nome").innerText = curriculumData.nomeCompleto || "";
  document.getElementById("pdf-cargo").innerText = curriculumData.cargo || "";
  document.getElementById("pdf-cidade").innerText = curriculumData.cidade || "";
  document.getElementById("pdf-email").innerText = curriculumData.email || "";
  document.getElementById("pdf-telefone").innerText = curriculumData.telefone || "";
  document.getElementById("pdf-link").innerText = curriculumData.linkProfissional || "";
  document.getElementById("pdf-resumo").innerText =
    curriculumData.resumoProfissional || "—";
  document.getElementById("pdf-cargo-empresa").innerText =
    curriculumData.cargoEmpresa || "";

  document.getElementById("pdf-empresa").innerText =
    curriculumData.empresa || "";

  document.getElementById("pdf-periodo").innerText =
    curriculumData.empregoAtual
      ? `${curriculumData.dataInicio || ""} - Atual`
      : `${curriculumData.dataInicio || ""} - ${curriculumData.dataFim || ""}`;

  document.getElementById("pdf-atividades").innerText =
    curriculumData.atividades || "";

  document.getElementById("pdf-curso").innerText =
    curriculumData.curso || "";

  document.getElementById("pdf-instituicao").innerText =
    curriculumData.instituicao || "";

  document.getElementById("pdf-ano").innerText =
    curriculumData.anoConclusao || "";

  document.getElementById("pdf-hard").innerText =
    curriculumData.hardSkills || "";

  document.getElementById("pdf-soft").innerText =
    curriculumData.softSkills || "";

  document.getElementById("pdf-idiomas").innerText =
    curriculumData.idiomaNome
      ? `${curriculumData.idiomaNome} — Leitura: ${curriculumData.nivelLeitura}, Escrita: ${curriculumData.nivelEscrita}, Conversação: ${curriculumData.nivelConversacao}`
      : "—";

  const curriculo = document.getElementById("curriculo-pdf");

  const originalStyle = {
    position: curriculo.style.position || "",
    left: curriculo.style.left || "",
    top: curriculo.style.top || "",
    display: curriculo.style.display || "",
    opacity: curriculo.style.opacity || "",
  };

  curriculo.style.position = "absolute";
  curriculo.style.left = "0";
  curriculo.style.top = "0";
  curriculo.style.display = "block";
  curriculo.style.opacity = "1";
  curriculo.style.pointerEvents = "none";

  const hasData = Object.values(curriculumData).some((v) => v !== "" && v !== undefined && v !== null && v !== false);
  if (!hasData) {
    console.error("Nenhum dado encontrado em curriculumData — cancelando geração de PDF.");
    alert("Não há dados salvos para gerar o PDF. Preencha os passos e tente novamente.");
    curriculo.style.position = originalStyle.position;
    curriculo.style.left = originalStyle.left;
    curriculo.style.top = originalStyle.top;
    curriculo.style.display = originalStyle.display;
    curriculo.style.opacity = originalStyle.opacity;
    curriculo.style.pointerEvents = "";
    return;
  }

  setTimeout(() => {
    try {
      const tempContainer = document.createElement("div");
      tempContainer.id = "curriculo-pdf-temp";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "0";
      tempContainer.style.top = "0";
      tempContainer.style.width = curriculo.style.width || "210mm";
      tempContainer.style.background = "white";
      tempContainer.style.padding = "0";
      tempContainer.style.zIndex = 99999;
      const clone = curriculo.cloneNode(true);
      clone.id = "curriculo-pdf-clone";
      clone.style.position = "relative";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.display = "block";
      clone.style.opacity = "1";

      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      try {
        if (window.html2canvas) {
          tempContainer.style.width = tempContainer.style.width || "794px";
          tempContainer.style.minHeight = tempContainer.style.minHeight || "1123px";

          html2canvas(tempContainer, { scale: 2, useCORS: true, backgroundColor: "#ffffff", scrollX: 0, scrollY: 0 })
            .then((canvas) => {
              const data = canvas.toDataURL("image/png");
              try {
                let doc;
                if (window.jspdf && window.jspdf.jsPDF) {
                  doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
                } else if (window.jsPDF) {
                  doc = new window.jsPDF("p", "mm", "a4");
                } else {
                  throw new Error("jsPDF não encontrado no escopo global");
                }

                const margin = 10;
                const pageWidth = 210;
                const pageHeight = 297;

                let imgWidth = pageWidth - margin * 2;
                let imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (imgHeight > pageHeight - margin * 2) {
                  imgHeight = pageHeight - margin * 2;
                  imgWidth = (canvas.width * imgHeight) / canvas.height;
                }

                doc.addImage(data, "PNG", margin, margin, imgWidth, imgHeight);
                doc.save("curriculo-profissional.pdf");

                if (tempContainer && tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
                curriculo.style.position = originalStyle.position;
                curriculo.style.left = originalStyle.left;
                curriculo.style.top = originalStyle.top;
                curriculo.style.display = originalStyle.display;
                curriculo.style.opacity = originalStyle.opacity;
                curriculo.style.pointerEvents = "";
              } catch (e) {
                console.error("Erro ao gerar PDF com jsPDF:", e);
                if (tempContainer && tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
                curriculo.style.position = originalStyle.position;
                curriculo.style.left = originalStyle.left;
                curriculo.style.top = originalStyle.top;
                curriculo.style.display = originalStyle.display;
                curriculo.style.opacity = originalStyle.opacity;
                curriculo.style.pointerEvents = "";
                alert("Ocorreu um erro ao gerar o PDF via jsPDF. Veja o console para mais detalhes.");
              }
            })
            .catch((err) => {
              console.error("Erro ao criar canvas para PDF:", err);
              if (tempContainer && tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
              curriculo.style.position = originalStyle.position;
              curriculo.style.left = originalStyle.left;
              curriculo.style.top = originalStyle.top;
              curriculo.style.display = originalStyle.display;
              curriculo.style.opacity = originalStyle.opacity;
              curriculo.style.pointerEvents = "";
              alert("Ocorreu um erro ao gerar o PDF. Veja o console para mais detalhes.");
            });
        } else {
          if (tempContainer && tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
        }
      } catch (e) {
        console.error("Exceção durante geração do PDF:", e);
        if (tempContainer && tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
        curriculo.style.position = originalStyle.position;
        curriculo.style.left = originalStyle.left;
        curriculo.style.top = originalStyle.top;
        curriculo.style.display = originalStyle.display;
        curriculo.style.opacity = originalStyle.opacity;
        curriculo.style.pointerEvents = "";
      }
      } catch (e) {
        console.error("Erro durante clonagem/geração:", e);
        curriculo.style.position = originalStyle.position;
        curriculo.style.left = originalStyle.left;
        curriculo.style.top = originalStyle.top;
        curriculo.style.display = originalStyle.display;
        curriculo.style.opacity = originalStyle.opacity;
        curriculo.style.pointerEvents = "";
      }
  }, 120);
}

