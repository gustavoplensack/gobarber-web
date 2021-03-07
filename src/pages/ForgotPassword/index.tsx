import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import { AnimationContainer, Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  // states
  const [loading, setLoading] = useState(false);

  // Refs
  const formRef = useRef<FormHandles>(null);

  // Contexts
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      // start loading
      setLoading(true);

      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigarório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // recuperação de senha

        const { email } = data;

        await api.post('/password/forgot', {
          email,
        });

        addToast({
          type: 'success',
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um email para a sua caixa com as instruções para recuperação de senha, cheque sua caixa.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar recuperar a senha, verifque seu email.',
          type: 'error',
        });
      } finally {
        // reset loading state
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <AnimationContainer>
        <Content>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </Content>
      </AnimationContainer>
      <Background />
    </Container>
  );
};
export default ForgotPassword;
