import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
import { meses } from 'data/meses';
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
      const response = await axios.get(`/assigned/answersByUser/${user?._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <span className="text-sm font-medium text-gray-700" key={total.count}>
          Respuestas ({meses[new Date().getMonth()]}): {total.count}
        </span>
      ))}{' '}
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
      const response = await axios.get(`/assigned/allAnswersByUser/${user?._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <span className="text-sm font-medium text-gray-700" key={total.totalCantidadRespuesta}>
          Respuestas estimadas: {total.totalCantidadRespuesta}
        </span>
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
      const response = await axios.get(`/radicados/answerByArea/${user?.departamento._id}`);
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {answers.map((total) => (
        <span className="text-sm font-medium text-gray-700" key={total.count}>
          Total respuestas área: {total.count}
        </span>
      ))}
    </div>
  );
}

const AssignmentsExpired = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    {
      user && fetchExpiredData();
    }
  }, [user]);
  const fetchExpiredData = async () => {
    try {
      const response = await axios.get(`/assigned/assignments-expired/${user._id}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Dentro de termino:</span>
        <div className="rounded-full flex justify-center items-center text-center font-bold w-8 h-8 bg-green-100 text-green-700">
          {data[0]?.total_within_the_time_limit || 0}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Pronto a vencer:</span>
        <div className="rounded-full flex justify-center items-center text-center font-bold w-8 h-8 bg-amber-100 text-amber-700">
          {data[0]?.total_soon_expired || 0}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Vencidas:</span>
        <div className="rounded-full flex justify-center items-center text-center font-bold w-8 h-8 bg-red-100 text-red-700">
          {data[0]?.total_expired || 0}
        </div>
      </div>
    </div>
  );
};

export { AnswersByUser, AllAnswers, AnswersByArea, AssignmentsExpired };
