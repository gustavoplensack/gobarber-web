import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import { AnimationContainer, Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  // Refs
  const formRef = useRef<FormHandles>(null);

  // Contexts
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const { push } = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigarório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Digite sua senha'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { email, password } = data;

        await signIn({ email, password });
        push('dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Impossível fazer login',
          description: 'Email ou senha inválidos, tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast, signIn, push],
  );

  return (
    <Container>
      <AnimationContainer>
        <Content>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Login</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <Link to="forgot-password">Esqueci minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </Content>
      </AnimationContainer>
      <Background />
    </Container>
  );
};
export default SignIn;
