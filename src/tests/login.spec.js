import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import App from '../App';

import { renderWithRouter } from './renderWithRouter';


describe('1 - Crie uma homepage de login com as seguintes especificações', () => {
  it('A rota para a página deve ser \'/\'', () => {
    const { history } = renderWithRouter(<App />);
    expect(history.location.pathname).toBe('/');
  });

  it('Crie um local para que o usuário insira email e senha', () => {
    renderWithRouter(<App />, '/');
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  it('Crie um botão com texto `Entrar`', () => {
    renderWithRouter(<App />, '/');

    const button = screen.getByLabelText(/Entrar/i);
    expect(button).toBeInTheDocument();
  });

  it('Verificações de campos de email, senha e botão', () => {
    renderWithRouter(<App />);

    const button = screen.getByLabelText(/Entrar/i);
    expect(button).toBeDisabled();

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');

    userEvent.type(email, 'email');
    userEvent.type(password, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'test@com@');
    userEvent.type(password, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'emailcom@');
    userEvent.type(password, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(password, '23456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.');
    userEvent.type(password, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(password, '123456');
    expect(button).toBeEnabled();
  });

  it('Salva o email no estado global do app, com a chave email, assim que o usuário concluir o login', () => {
    const { store } = renderWithRouter(<App />);
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const button = screen.getByLabelText(/Entrar/i);

    userEvent.type(email, 'someone@email.com');
    userEvent.type(password, '123456');
    fireEvent.click(button);

    expect(store.getState().user.email).toBe('someone@email.com');
  });

  it('Rota deve ser alterada para `carteira` após clique no botão', () => {
    const { history } = renderWithRouter(<App />);
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const button = screen.getByLabelText(/Entrar/i);

    userEvent.type(email, 'someone@email.com');
    userEvent.type(password, '123456');
    fireEvent.click(button);

    expect(history.location.pathname).toBe('/carteira');
  });
});
