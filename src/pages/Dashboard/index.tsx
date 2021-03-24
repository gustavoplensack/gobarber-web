/* eslint-disable camelcase */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

interface IMonthAvailabiltyItem {
  day: number;
  availability: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  formatted_hour: string;
  customer: {
    name: string;
    avatar_url: string;
    provider_id: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabiltyItem[]
  >([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability/`, {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user]);

  useEffect(() => {
    api
      .get<IAppointment[]>(`/appointments/me`, {
        params: {
          day: selectedDay.getDate(),
          month: selectedDay.getMonth() + 1,
          year: selectedDay.getFullYear(),
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          return {
            ...appointment,
            formatted_hour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(formattedAppointments);
      });
  }, [user, selectedDay]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.availability === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && isAfter(day, new Date())) {
      setSelectedDay(day);
    }
  }, []);

  const formattedDay = useMemo(() => {
    return format(selectedDay, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDay]);

  const formattedDayOfWeek = useMemo(() => {
    return format(selectedDay, 'cccc', { locale: ptBR });
  }, [selectedDay]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);
  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber logo" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDay) && <span>Hoje</span>}
            <span>{formattedDay}</span>
            <span>{formattedDayOfWeek}</span>
          </p>
          {isToday(selectedDay) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.customer.avatar_url}
                  alt={nextAppointment.customer.name}
                />

                <strong>{nextAppointment.customer.name}</strong>
                <span>
                  <FiClock />
                  08:00
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}
            {morningAppointments.map(appointment => {
              return (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.formatted_hour}
                  </span>
                  <div>
                    <img
                      src={appointment.customer.avatar_url}
                      alt={appointment.customer.name}
                    />

                    <strong>{appointment.customer.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}
            {afternoonAppointments.map(appointment => {
              return (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.formatted_hour}
                  </span>
                  <div>
                    <img
                      src={appointment.customer.avatar_url}
                      alt={appointment.customer.name}
                    />

                    <strong>{appointment.customer.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            selectedDays={selectedDay}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
