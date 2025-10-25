import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService, { Quiz, Question } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const res = await quizService.getQuiz(id!);
        const quizData = res.data.data?.quiz || res.data.data?.quizzes?.[0];
        setQuiz(quizData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    toast.success("Quiz submitted! (This is just frontend demo)");
    navigate("/dashboard");
  };

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (!quiz) return <p className="text-center mt-8">Quiz not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-muted-foreground mb-6">{quiz.description}</p>

      {quiz.questions.map((q: Question, index) => (
        <Card key={q._id} className="mb-4">
          <CardHeader>
            <CardTitle>
              {index + 1}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {q.options && q.options.length > 0 ? (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q._id}
                      value={i}
                      checked={answers[q._id] === i}
                      onChange={() => handleChange(q._id, i)}
                      className="form-radio"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Your answer..."
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
              />
            )}
          </CardContent>
        </Card>
      ))}

      <Button className="mt-4" onClick={handleSubmit}>
        Submit Quiz
      </Button>
    </div>
  );
};

export default QuizDetail;
