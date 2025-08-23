export class DocumentValidatorService {
  private static validCalc(x: number, numbers: string) {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = parseInt(slice[x - i]);
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }

    const result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  }

  static validarCpf(value: string): boolean {
    const formattedCpf = value.replace(/\D/g, '');

    if (formattedCpf.length !== 11 || [...new Set(formattedCpf)].length === 1)
      return false;

    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(formattedCpf[i]) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(formattedCpf[9])) return false;

    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(formattedCpf[i]) * (11 - i);
    rev = 11 - (add % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(formattedCpf[10])) return false;

    return true;
  }

  static validarCnpj(value: string): boolean {
    const formattedCnpj = value.replace(/\D/g, '');

    if (formattedCnpj.length !== 14 || [...new Set(formattedCnpj)].length === 1)
      return false;

    const digits = formattedCnpj.slice(12);
    const digit0 = this.validCalc(12, formattedCnpj);
    if (digit0.toString() !== digits[0]) return false;

    const digit1 = this.validCalc(13, formattedCnpj);
    return digit1.toString() === digits[1];
  }
}
