import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
function AnswersByUser() {
  const [answers, setAnswers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    {
      user && fetchAnswers();
    }
  }, [user]);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`/assigned/AnswersByUser/${user._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <p key={total.cantidad}>Respuestas: {total.cantidad}</p>
      ))}
    </div>
  );
}

function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    {
      user && fetchAnswers();
    }
  }, [user]);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`/assigned/AllAnswersByUser/${user._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <p key={total.totalCantidadRespuesta}>Total respuestas estimadas: {total.totalCantidadRespuesta}</p>
      ))}
    </div>
  );
}

function AnswersByArea() {
  const [answers, setAnswers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    {
      user && fetchAnswers();
    }
  }, [user]);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`/radicados/answerByArea/${user.departamento._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <p key={total.count}>Total respuestas área: {total.count}</p>
      ))}
    </div>
  );
}

export { AnswersByUser, AllAnswers, AnswersByArea };
