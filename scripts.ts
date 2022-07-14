interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
} //Veiculo

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  function calcTempo(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor(mil % 60000) / 1000;
    return `${min}m e ${sec}s`;
  } //calcTempo

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    } //ler

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    } //salvar

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      
      <td>
        <button class="delete" data-placa="${veiculo.placa}">X</button>
      </td>
      `;

      row.querySelector(".delete")?.addEventListener("click", function () {
        remover(this.dataset.placa);
      });

      $("#patio")?.appendChild(row);
      //...todos os antigos, e adiciona os novos também
      if (salva) salvar([...ler(), veiculo]);
    } //adicionar

    function remover(placa: string) {
      const { entrada, nome } = ler().find(
        (veiculo) => veiculo.placa === placa
      );

      const tempo = calcTempo(
        new Date().getTime() - new Date(entrada).getTime()
      );

      if (
        !confirm(`O veículo ${nome} permaneceu por ${tempo}, deseja encerrar?`)
      )
        return;
      salvar(ler().filter((veiculo) => this.placa !== placa));
      render();
    } //remover

    function render() {
      // "!" - force a verificação da propriedade innerHTML, quando você tem certeza que existe.
      $("#patio")!.innerHTML = "";
      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      } //if
    } //render

    return { ler, adicionar, remover, salvar, render };
  } //patio
  patio().render();
  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Os campos nome e placa são obrigatórios");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
})(); //(functio(){})()
