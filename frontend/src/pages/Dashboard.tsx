 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService, { Quiz } from "@/services/quizService";
import announcementService, { Announcement } from "@/services/announcementService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LayoutDashboard, Calendar, BookOpen, ClipboardList, BarChart2, Bell, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import BlurText from "../components/ui/SplitText";
import { useTranslation } from "@/hooks/TranslationContext";
import { useTranslation as useI18nTranslation } from "react-i18next";
import StyledCard from "../components/ui/cardss"; // مسار الكارت الجديد

const Dashboard = () => {
  const { toggleLanguage, language } = useTranslation();
  const { t } = useI18nTranslation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUsername = localStorage.getItem("username");
    if (!token) {
      navigate("/login");
      return;
    }
    if (savedUsername) setUsername(savedUsername);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [quizRes, announcementRes] = await Promise.all([
          quizService.getQuizzes(),
          announcementService.getAnnouncements(),
        ]);

        const quizData = quizRes.data.data?.quizzes
          ? quizRes.data.data.quizzes
          : quizRes.data.data?.quiz
            ? [quizRes.data.data.quiz]
            : [];
        setQuizzes(quizData);

        // Announcement data
        const ann = announcementRes.data.data?.announcements;  
const announcementData = ann ? ann : [];
setAnnouncements(announcementData);
         

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`fixed top-0 left-0 h-full bg-sky-500 shadow-md flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
        <div>
          <div className="flex items-center gap-2 px-6 py-5 border-b bg-gray-50">
            <GraduationCap className="w-7 h-7 text-sky-600" />
            {sidebarOpen && <h1 className="text-lg font-bold">Coligo</h1>}
          </div>
          <nav className="mt-6 space-y-1 bg-sky-500">
            {sidebarOpen && (
              <>
                <SidebarLink icon={<LayoutDashboard />} label="Dashboard" />
                <SidebarLink icon={<Calendar />} label="Schedule" />
                <SidebarLink icon={<BookOpen />} label="Courses" />
                <SidebarLink icon={<ClipboardList />} label="Gradebook" />
                <SidebarLink icon={<BarChart2 />} label="Performance" />
                <SidebarLink icon={<Bell />} label="Announcement" />
              </>
            )}
          </nav>
        </div>
        {sidebarOpen && (
          <button
            onClick={handleLogout}
            className="font-serif font-bold relative w-40 text-white h-10 text-[15px] rounded-full overflow-hidden m-5 p-2.5 cursor-pointer before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-[#19b6ff] before:to-[#082d91] before:rounded-full before:z-[-1] before:transition-[width] before:duration-1000 hover:before:w-full"
          >
            {t('logout')}
          </button>
        )}
      </aside>

      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <button className="mb-4 p-2 border rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="flex flex-wrap items-center font-serif font-bold text-2xl">
              <BlurText
                text="Welcome To Your Dashboard:"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="mr-2"
              />
              <span>{username}</span>
            </h1>
          </div>

          <div className="relative flex">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
              title="Toggle Language"
            >
              {language.startsWith("en") ? "AR" : "EN"}
            </button>

            <img
              src="/public/client6.png"
              alt="profile"
              className="rounded-full w-10 h-10 border ml-4"
            />
          </div>
        </div>

        <Card className="bg-sky-600 text-white mb-8">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold">{t('exams_time')}</h3>
              <p className="text-sm opacity-90 max-w-lg mt-2">{t('exams_description')}</p>
              <p className="italic text-xs mt-2">{t('quote')}</p>
            </div>
            <Button variant="secondary" className="bg-white text-sky-700 font-semibold hover:bg-slate-100">
              View exams tips
            </Button>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="text-center text-gray-500">{t('x')}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            <div className="lg:col-span-2">
              <h4 className="text-lg font-semibold mb-4">{t('Announcements')}</h4>
              <div className="space-y-4 ">
  {announcements.length > 0 ? (
    announcements.map((announcement) => (
      <StyledCard key={announcement._id}>
       <div className="space-y-4    ">
  {announcements.length > 0 ? (
    announcements.map((announcement) => (
      <StyledCard key={announcement._id}>
        <h3 className="text-3xl font-bold  text-white">{announcement.title}</h3>
        <h6 className=" text-blue-900 text-2xl">{announcement.priority}</h6>
        <h6 className="text-sky-950 text-xl">{announcement.course}</h6>
        <p className="text-xs opacity-80">
          {new Date(announcement.publishDate).toLocaleDateString()}
        </p>
        <p className="text-xl text-gray-100 mt-2">{announcement.content}</p>
      </StyledCard>
    ))
  ) : (
    <p className="text-gray-500 text-sm">{t('y')}</p>
  )}
</div>

      </StyledCard>
    ))
  ) : (
    <p className="text-gray-500 text-sm">{t('y')}</p>
  )}
</div>

            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">What’s due</h4>
              <div className="space-y-4">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <Card key={quiz._id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-sky-700 text-base">{quiz.title}</CardTitle>
                        <p className="text-xs text-gray-400">Created at: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{quiz.description || "No description provided."}</p>
                        <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">Start Quiz</Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No quizzes available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <button className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium ${active ? "bg-sky-100 text-sky-700 border-l-4 border-sky-600" : "text-gray-600 hover:bg-gray-100"}`}>
    <span className="w-5 h-5">{icon}</span>
    {label}
  </button>
);

export default Dashboard;
