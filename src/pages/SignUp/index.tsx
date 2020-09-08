import React from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';

import { Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignIn: React.FC = () => (
  <Container>
    <Background />

    <Content>
      <img src={logoImg} alt="GoBarber" />
      <form>
        <h1>Faça seu Login</h1>

        <Input name="username" icon={FiUser} placeholder="Nome" />

        <Input name="email" icon={FiMail} placeholder="Email" />

        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Senha"
        />

        <Button type="submit">Cadastrar</Button>
      </form>

      <a href="aaa">
        <FiArrowLeft />
        Voltar para Login
      </a>
    </Content>
  </Container>
);

export default SignIn;
