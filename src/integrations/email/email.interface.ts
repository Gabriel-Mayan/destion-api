export type ISendMail = {
  to: string;
  subject: string;
  template: string;
  context: object;
};
