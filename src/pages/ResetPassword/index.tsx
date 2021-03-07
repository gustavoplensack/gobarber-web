/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import { AnimationContainer, Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas não são iguais!',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }

        addToast({
          title: 'Erro ao redefinir a senha',
          description:
            'Impossível resetar a senha, tente novamente mais tarde.',
          type: 'error',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirme sua senha"
            />

            <Button type="submit">Redefinir senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
