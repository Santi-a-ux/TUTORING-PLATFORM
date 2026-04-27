const { useState } = React;

const IconLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#6C63FF"/>
    <path d="M20 11L27 17V27L20 31L13 27V17L20 11Z" fill="white"/>
  </svg>
);

const IconWrapper = ({ children, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer transition-colors duration-200 p-3 rounded-xl hover:bg-indigo-50 ${active ? 'text-[#6C63FF] bg-indigo-50' : 'text-[#9E9E9E] hover:text-[#6C63FF]'}`}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </div>
);

const IconMap = (props) => <IconWrapper {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></IconWrapper>;
const IconSearch = (props) => <IconWrapper {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></IconWrapper>;
const IconChat = (props) => <IconWrapper {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></IconWrapper>;
const IconProfile = (props) => <IconWrapper {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></IconWrapper>;
const IconBell = (props) => <IconWrapper {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></IconWrapper>;
const IconMenu = (props) => <IconWrapper {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></IconWrapper>;

// --- Components Step 2: Login & Register --- //
const InputField = ({ label, type = "text", placeholder, showEye, onToggleEye, value, setValue }) => (
  <div className="mb-4 text-left">
    <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 bg-white text-[#1A1A2E] focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-colors"
        value={value}
        onChange={(e) => setValue && setValue(e.target.value)}
      />
      {showEye !== undefined && (
        <button 
          type="button" 
          onClick={onToggleEye}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#6C63FF] transition-colors focus:outline-none"
        >
          {showEye ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          )}
        </button>
      )}
    </div>
  </div>
);

const RadioRole = ({ id, label, selected, onChange }) => (
  <label htmlFor={id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${selected ? 'border-[#6C63FF] bg-indigo-50/50' : 'border-[#E0E0E0] hover:border-gray-300'}`}>
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected ? 'border-[#6C63FF]' : 'border-gray-300'}`}>
      {selected && <div className="w-2 h-2 rounded-full bg-[#6C63FF]"></div>}
    </div>
    <span className={`text-sm font-medium ${selected ? 'text-[#6C63FF]' : 'text-[#757575]'}`}>{label}</span>
    <input 
      type="radio" 
      id={id} 
      name="role" 
      value={id} 
      className="hidden" 
      onChange={() => onChange(id)}
      checked={selected}
    />
  </label>
);

const SideIllustration = ({ title, subtitle }) => (
  <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#6C63FF] to-[#8C84FF] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -m-20 w-64 h-64 bg-indigo-900 opacity-20 rounded-full blur-3xl"></div>
    
    <div className="z-10 text-center max-w-sm">
      <div className="w-24 h-24 bg-white/20 rounded-2xl backdrop-blur-sm mx-auto mb-8 flex items-center justify-center border border-white/30 rotate-12 hover:rotate-0 transition-all duration-500 shadow-xl">
        <IconLogo />
      </div>
      <h2 className="text-3xl font-bold mb-4 leading-tight">{title}</h2>
      <p className="text-indigo-100 text-lg leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const ViewRegister = ({ setCurrentView, setGlobalUser, setIsLoggedIn }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [role, setRole] = useState('aprendiz');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await api.register({ email, password, role });
    setLoading(false);
    if (data) {
      if (setGlobalUser) setGlobalUser({ name: "Nuevo Usuario", email, role });
      if (setIsLoggedIn) setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden w-full max-w-5xl mx-auto h-[600px] animate-fade-in-up">
      <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2 tracking-tight">Crea tu cuenta</h2>
          <p className="text-[#757575] mb-8 text-sm">Únete a cientos de estudiantes y tutores.</p>

          <form className="space-y-1" onSubmit={handleRegister}>
            <InputField label="Correo Electrónico" type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Contraseña" type={showPwd ? "text" : "password"} placeholder="••••••••" showEye={showPwd} onToggleEye={() => setShowPwd(!showPwd)} value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputField label="Confirmar Contraseña" type={showConfirmPwd ? "text" : "password"} placeholder="••••••••" showEye={showConfirmPwd} onToggleEye={() => setShowConfirmPwd(!showConfirmPwd)} />
            
            <div className="pt-4 pb-2">
              <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Soy:</label>
              <div className="grid grid-cols-3 gap-3">
                <RadioRole id="aprendiz" label="Aprendiz" selected={role === 'aprendiz'} onChange={setRole} />
                <RadioRole id="tutor" label="Tutor" selected={role === 'tutor'} onChange={setRole} />
                <RadioRole id="ambos" label="Ambos" selected={role === 'ambos'} onChange={setRole} />
              </div>
            </div>

<button type="submit" disabled={loading} className="w-full bg-[#6C63FF] text-white rounded-lg py-3.5 font-semibold mt-6 hover:bg-[#5b54d6] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100">
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-[#757575] text-sm mt-8">
            ¿Ya tienes una cuenta? <button onClick={() => setCurrentView('login')} className="text-[#6C63FF] font-semibold hover:underline">Inicia Sesión</button>
          </p>
        </div>
      </div>
      <SideIllustration title="Acelera tu aprendizaje" subtitle="Encuentra a tu tutor ideal o comienza a compartir tu conocimiento con el mundo." />
    </div>
  );
};

const ViewLogin = ({ setCurrentView, setGlobalUser, setIsLoggedIn }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState('aprendiz');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await api.login(email, password);
    setLoading(false);
    if (data) {
      if (setGlobalUser) setGlobalUser(data.user || { name: "Usuario", email });
      if (setIsLoggedIn) setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden w-full max-w-5xl mx-auto h-[600px] animate-fade-in-up">
      <SideIllustration title="Bienvenido de vuelta" subtitle="Nos alegra verte por aquí. El conocimiento te espera." />
      <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2 tracking-tight">Iniciar Sesión</h2>
          <p className="text-[#757575] mb-8 text-sm">Ingresa tus credenciales para continuar.</p>

          <form className="space-y-1" onSubmit={handleLogin}>
            <InputField label="Correo Electrónico" type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Contraseña" type={showPwd ? "text" : "password"} placeholder="••••••••" showEye={showPwd} onToggleEye={() => setShowPwd(!showPwd)} value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <div className="flex justify-end mb-4">
              <button type="button" className="text-[#6C63FF] text-sm font-medium hover:underline">¿Olvidaste tu contraseña?</button>
            </div>

            <div className="pt-2 pb-2">
              <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Continuar como:</label>
              <div className="grid grid-cols-3 gap-3">
                <RadioRole id="aprendiz_login" label="Aprendiz" selected={role === 'aprendiz_login'} onChange={setRole} />
                <RadioRole id="tutor_login" label="Tutor" selected={role === 'tutor_login'} onChange={setRole} />
                <RadioRole id="ambos_login" label="Ambos" selected={role === 'ambos_login'} onChange={setRole} />
              </div>
            </div>

<button type="submit" disabled={loading} className="w-full bg-[#6C63FF] text-white rounded-lg py-3.5 font-semibold mt-8 hover:bg-[#5b54d6] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100">
                {loading ? 'Conectando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-[#757575] text-sm mt-8">
            ¿No tienes una cuenta? <button onClick={() => setCurrentView('register')} className="text-[#6C63FF] font-semibold hover:underline">Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  );
};
// --- End Components Step 2 --- //

// --- Components Step 3: Home Feed --- //
const Avatar = ({ initials, bg = "bg-[#6C63FF]", online = false, className = "" }) => (
  <div className={`relative flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold ${bg} ${className}`}>
    {initials}
    {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>}
  </div>
);

const Chip = ({ text }) => (
  <span className="bg-[#EDE7F6] text-[#6C63FF] px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-200 transition-colors inline-block">
    {text}
  </span>
);

const PostCard = ({ name, role, text, tags, likes, comments, initials, bg }) => (
  <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 mb-5 transition-transform hover:-translate-y-1 duration-200">
    <div className="flex items-center gap-3 mb-3">
      <Avatar initials={initials} bg={bg} className="w-10 h-10" />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-[#1A1A2E] text-sm">{name}</h4>
          <span className="text-[#9E9E9E] text-xs">•</span>
          <span className="text-[#757575] text-xs font-medium">{role}</span>
        </div>
      </div>
    </div>
    <p className="text-[#1A1A2E] text-sm mb-4 leading-relaxed">{text}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(t => <Chip key={t} text={t} />)}
    </div>
    <div className="flex items-center gap-6 border-t border-gray-50 pt-3">
      <button className="flex items-center gap-1.5 text-[#9E9E9E] hover:text-[#6C63FF] transition-colors text-sm font-medium">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        {likes}
      </button>
      <button className="flex items-center gap-1.5 text-[#9E9E9E] hover:text-[#6C63FF] transition-colors text-sm font-medium">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        {comments}
      </button>
    </div>
  </div>
);

const ViewHome = ({ setCurrentView, setSelectedProfileId }) => {
  const [tutors, setTutors] = React.useState([]);

  React.useEffect(() => {
    api.getTutors().then(setTutors);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full animate-fade-in-up">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-3xl">
        {/* Create Post Card */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 mb-6">
          <h3 className="font-bold text-[#1A1A2E] mb-3 text-[15px]">¿Qué quieres aprender hoy?</h3>
          <div className="flex gap-3 mb-4">
            <Avatar initials="LG" bg="bg-[#FF6B35]" className="w-10 h-10" />
            <input 
              type="text" 
              placeholder="Escribe lo que necesitas o quieres enseñar..." 
              className="flex-1 bg-[#E8EAF6]/30 border border-[#E0E0E0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2 hidden sm:flex">
              <Chip text="Java" />
              <Chip text="Inglés" />
              <Chip text="Matemáticas" />
              <Chip text="Psicología" />
              <Chip text="Diseño Web" />
            </div>
            <button className="bg-[#6C63FF] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#5b54d6] hover:shadow-md transition-all ml-auto">
              Publicar
            </button>
          </div>
        </div>

        {/* Posts */}
          <div className="space-y-4">
            {tutors.map((tutor) => (
               <PostCard 
                 key={tutor.id}
                 name={tutor.name}
                 role={tutor.fullRole || tutor.role}
                 text={`¡Hola! Soy experto en ${tutor.role} y otras áreas afines. Estaría encantado de ayudarte a mejorar. Puedes agendar una tutoría conmigo por ${tutor.rate}$/hora.`}
                 tags={tutor.specialties}
                 likes={tutor.likes}
                 comments={tutor.comments}
                 initials={tutor.initials}
                 bg={tutor.bg}
               />
            ))}
          </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
        
        {/* Tutores Cercanos */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <h3 className="font-bold text-[#1A1A2E] mb-4 text-sm">Tutores Cercanos</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setCurrentView('profile')}>
              <div className="flex items-center gap-3">
                <Avatar initials="JR" bg="bg-[#6C63FF]" online={true} className="w-10 h-10" />
                <div>
                  <h4 className="font-semibold text-sm text-[#1A1A2E]">Javier Ríos</h4>
                  <p className="text-xs text-[#757575]">Inglés</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setCurrentView('chat'); }} className="w-8 h-8 rounded-full bg-[#E8EAF6] flex items-center justify-center text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setCurrentView('profile')}>
              <div className="flex items-center gap-3">
                <Avatar initials="SM" bg="bg-[#FF6B35]" className="w-10 h-10" />
                <div>
                  <h4 className="font-semibold text-sm text-[#1A1A2E]">Sofia Martinez</h4>
                  <p className="text-xs text-[#757575] truncate w-24">Diseño Gráfico...</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setCurrentView('chat'); }} className="w-8 h-8 rounded-full bg-[#E8EAF6] flex items-center justify-center text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes Recientes */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <h3 className="font-bold text-[#1A1A2E] mb-4 text-sm">Mensajes Recientes</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Avatar initials="DP" bg="bg-[#6C63FF]" online={true} className="w-10 h-10" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-[#1A1A2E]">Daniel Pérez</h4>
                <p className="text-xs text-[#757575] leading-tight mb-2">Experto en Matemáticas</p>
                <button onClick={() => setCurrentView('chat')} className="text-xs font-semibold text-[#6C63FF] hover:underline">Contactar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Distancias */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <h3 className="font-bold text-[#1A1A2E] mb-4 text-sm">Distancia del GPS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-[#1A1A2E] font-medium">Daniel Pérez</span>
                <span className="text-xs text-[#757575]">Inglés</span>
              </div>
              <span className="text-[#4CAF50] font-semibold flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg> 10 min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-[#1A1A2E] font-medium">Sofia Martinez</span>
                <span className="text-xs text-[#757575]">Diseño</span>
              </div>
              <span className="text-[#FFC107] font-semibold flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg> 32 min</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
// --- End Components Step 3 --- //

// --- Components Step 4: Profiles --- //
const ViewProfile = ({ setCurrentView, selectedProfileId, globalUser }) => {
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // We consider it "own profile" if selectedProfileId is null, 
  // or if selectedProfileId matches the globalUser's user_id.
  const isOwnProfile = !selectedProfileId || (globalUser && selectedProfileId === globalUser.user_id);

  React.useEffect(() => {
    setLoading(true);
    api.getProfile(selectedProfileId).then((data) => {
      setProfileData(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedProfileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
      </div>
    );
  }

  const displayName = profileData?.display_name || (isOwnProfile ? "Mi Perfil" : "Tutor");
  const bio = profileData?.bio || "Experto en matemáticas, preparado para ayudarte.";
  const locationName = profileData?.location_name || "Desconocido";
  const roleName = isOwnProfile ? "Aprendiz" : "Tutor Experto";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-[#6C63FF] transition-colors flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver
        </button>
        {isOwnProfile && (
          <button className="text-sm font-semibold text-[#6C63FF] bg-[#EDE7F6] px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Editar Mi Perfil
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="flex-1 lg:max-w-[400px]">
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center text-center">
            
            <div className="relative mb-5">
              <Avatar 
                initials={initials} 
                bg={isOwnProfile ? "bg-[#FF6B35]" : "bg-[#6C63FF]"} 
                className="w-28 h-28 text-3xl shadow-md" 
                online={!isOwnProfile} 
              />
            </div>
            
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-1">
              {displayName}
            </h2>
            <p className="text-[#757575] font-medium mb-2">
              {roleName}
            </p>
            <p className="text-sm text-[#9E9E9E] font-medium mb-4 flex items-center justify-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {locationName}
            </p>

            {!isOwnProfile && (
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 text-[#FFC107] mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-[#1A1A2E] font-bold text-sm">4.8 <span className="text-[#9E9E9E] font-normal">(55 reseñas)</span></span>
                </div>
                <p className="text-sm text-[#424242] itali italic leading-tight px-4">{bio}</p>
              </div>
            )}

            {isOwnProfile && (
              <div className="w-full text-left mb-6">
                <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Intereses:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Chip text="Python ✏" />
                  <Chip text="Matemáticas" />
                  <Chip text="Inglés" />
                  <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">+</button>
                </div>
              </div>
            )}

            <button 
              onClick={() => isOwnProfile ? alert('Perfil Guardado') : setCurrentView('chat')}
              className="w-full bg-[#6C63FF] text-white py-3.5 rounded-xl font-bold hover:bg-[#5b54d6] hover:shadow-lg transition-all"
            >
              {isOwnProfile ? 'Guardar Cambios' : 'Contactar'}
            </button>
          </div>
        </div>

        {/* Right Column (Details) */}
        <div className="flex-1 bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50">
          
          {!isOwnProfile ? (
            // Tutor Detail View
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Experiencia y Presentación
                </h3>
                <div className="flex gap-3 mb-4">
                  <span className="bg-[#E8EAF6] text-[#6C63FF] px-3 py-1.5 rounded-lg text-xs font-bold">+5 años</span>
                  <span className="bg-[#E8EAF6] text-[#6C63FF] px-3 py-1.5 rounded-lg text-xs font-bold">+30 h dictadas</span>
                </div>
                <p className="text-[#424242] text-sm leading-relaxed">
                  {bio}
                </p>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#1A1A2E] flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Zonas y Disponibilidad
                  </h3>
                </div>
                
                <div className="bg-[#FAFAFA] rounded-xl p-5 mb-5 border border-gray-100">
                  <h4 className="font-semibold text-[#1A1A2E] text-sm mb-3">Zonas de encuentro 📍</h4>
                  <p className="text-sm text-[#757575] mb-2 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg> Cerca de {locationName}</p>
                  <p className="text-sm text-[#757575] flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg> Preferible en Biblioteca central o presencial</p>
                </div>
              </section>
            </div>
          ) : (
            // Own Profile Checklist View
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Ajusta tu Perfil</h3>
              <p className="text-[#757575] text-sm mb-6">Completa tu perfil para conectar con la comunidad, ya sea para enseñar o para aprender nuevas cosas.</p>
              
              <div className="space-y-4">
                <div onClick={() => alert('Sección de Contacto (Funcionalidad Mock)')} className="flex items-start gap-4 p-4 rounded-xl bg-[#F0FDF4] border border-[#C8E6C9] cursor-pointer transition-colors group hover:bg-[#c8e6c9]">
                  <div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center flex-shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A1A2E]">Identidad y Contacto</h4>
                    <p className="text-xs text-[#757575] mt-1">Nombre: {displayName}. Registrado correctamente.</p>
                  </div>
                </div>

                <div onClick={() => alert('Sección de Información (Funcionalidad Mock)')} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#6C63FF] cursor-pointer transition-colors group">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[#6C63FF]"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#6C63FF]">Información Personal</h4>
                    <p className="text-xs text-[#757575] mt-1">{bio}</p>
                  </div>
                </div>

                <div onClick={() => alert('Sección de Ubicación (Funcionalidad Mock)')} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#6C63FF] cursor-pointer transition-colors group">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[#6C63FF]"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#6C63FF]">Ubicación y Distancia GPS</h4>
                    <p className="text-xs text-[#757575] mt-1">Has activado: {locationName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
// --- End Components Step 4 --- //

// --- Components Step 5: Map --- //
const ViewMap = ({ setCurrentView, setSelectedProfileId }) => {
  const [selectedTutor, setSelectedTutor] = React.useState(null);
  const [tutors, setTutors] = React.useState([]);
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    api.getTutors().then(setTutors);
  }, []);

  React.useEffect(() => {
    // Si la librería L (Leaflet) no está disponible, no hacer nada (prevenir errores si hay retraso en el CDN)
    if (!mapRef.current || !window.L) return;
    
    // Evitar inicializar Leaflet dos veces en desarrollo
    if (tutors.length > 0 && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([6.24, -75.58], 13);
      
      // OpenStreetMap estándar (carga más rápido y es más estable que Carto en algunos entornos)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

      // FIX CLAVE: Forzar a Leaflet a recalcular su tamaño una vez que las animaciones / pestañas terminan.
      // Esto evita que el mapa se vea a la mitad o con recuadros grises al cargar.
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 300);

      tutors.forEach(tutor => {
        // Marcador HTML personalizado con estilos de Tailwind en línea (Leaflet los renderiza fuera del DOM de React)
        const iconHtml = `
          <div class="relative cursor-pointer hover:scale-110 transition-transform duration-300" style="animation: bounce 2s infinite; animation-delay: ${tutor.id * 100}ms;">
            <div class="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold w-12 h-12 border-[3px] border-white shadow-lg relative z-10 text-sm" style="background-color: ${tutor.color}">
              ${tutor.initials}
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>
            </div>
            <div class="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white absolute left-1/2 -bottom-2 -translate-x-1/2 z-0 filter drop-shadow-sm"></div>
          </div>
        `;
        const icon = L.divIcon({ 
          html: iconHtml, 
          className: 'bg-transparent border-none', // Override L.divIcon default styles
          iconSize: [48, 56], 
          iconAnchor: [24, 56] 
        });
        
        const marker = L.marker([tutor.lat, tutor.lng], { icon }).addTo(mapInstance.current);
        marker.on('click', () => {
          setSelectedTutor(tutor);
          // Centrar el mapa con animación
          mapInstance.current.setView([tutor.lat, tutor.lng], 15, { animate: true });
        });
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [tutors]);

  return (
    <div className="relative w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] h-[calc(100vh-5rem)] bg-[#E8EAF6] animate-fade-in -mx-6 md:-mx-10 -mt-8 overflow-hidden rounded-tl-xl border-t border-l border-white/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
      
      {/* Real Interactive Leaflet Container */}
      <div ref={mapRef} className="absolute inset-0 z-0 bg-gray-100"></div>

      {/* Search Bar - High z-index to stay above Leaflet controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-[1000] animate-fade-in-up">
        <div className="flex items-center bg-white/95 backdrop-blur-sm border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-xl px-4 py-3 w-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Buscar por materia o ubicación..." className="bg-transparent border-none outline-none text-sm w-full ml-3 text-[#1A1A2E]" />
        </div>
      </div>

      {/* Bottom Sheet for Selected Tutor */}
      {selectedTutor && (
        <div className="absolute z-[1000] bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_15px_40px_rgba(108,99,255,0.2)] w-11/12 max-w-sm animate-fade-in-up border border-indigo-50/50">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-[#FF6B35] transition-colors" onClick={() => setSelectedTutor(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="flex items-center gap-4">
            <Avatar initials={selectedTutor.initials} bg={selectedTutor.bg} className="w-16 h-16 shadow-md" online={true} />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#1A1A2E] leading-tight">{selectedTutor.name}</h3>
              <p className="text-sm text-[#757575] font-medium mt-0.5">{selectedTutor.role}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => { setSelectedProfileId(selectedTutor.user_id); setCurrentView('profile'); }} className="flex-1 bg-indigo-50 text-[#6C63FF] py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-colors">
              Ver Perfil
            </button>
            <button onClick={() => setCurrentView('chat')} className="flex-1 bg-[#6C63FF] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5b54d6] shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Contactar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// --- End Components Step 5 --- //

// --- Components Step 6: Chat & Schedule --- //
const ScheduleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-fade-in-up border border-white/20">
        
        {/* Modal Header */}
        <div className="bg-[#6C63FF] p-4 flex items-center justify-between text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <h3 className="font-bold text-lg relative z-10 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Agendar Tutoría
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors relative z-10"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        
        {/* Info Tutor */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <Avatar initials="DP" bg="bg-[#6C63FF]" className="w-12 h-12 shadow-sm" online={true} />
          <div>
            <h4 className="font-bold text-[#1A1A2E] text-base">Daniel Pérez</h4>
            <p className="text-xs text-[#6C63FF] font-semibold bg-[#E8EAF6] px-2 py-0.5 rounded uppercase tracking-wide inline-block mt-1">Presencial · 1hr</p>
          </div>
        </div>
        
        {/* Calendar mock */}
        <div className="p-6">
           <div className="flex items-center justify-between mb-5">
             <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9E9E9E] hover:bg-gray-100 hover:text-[#6C63FF] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
             <span className="font-bold text-[#1A1A2E]">Abril 2026</span>
             <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9E9E9E] hover:bg-gray-100 hover:text-[#6C63FF] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
           </div>
           
           <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#9E9E9E] mb-3">
             <div className="text-red-400">D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div className="text-[#6C63FF]">S</div>
           </div>
           
           <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm font-medium text-[#1A1A2E]">
             <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">1</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">2</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center bg-[#6C63FF] text-white rounded-full font-bold shadow-md cursor-pointer hover:bg-[#5b54d6] transition-colors ring-2 ring-[#6C63FF] ring-offset-2">3</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors relative">
                4<div className="absolute bottom-1 right-1 w-1 h-1 bg-[#FF6B35] rounded-full"></div>
             </div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">5</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors relative">
                6<div className="absolute bottom-1 right-1 w-1 h-1 bg-[#FF6B35] rounded-full"></div>
             </div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">7</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">8</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">9</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center hover:bg-[#E8EAF6] hover:text-[#6C63FF] rounded-full cursor-pointer transition-colors">10</div>
           </div>
           
           <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
             <button className="flex-1 text-[#757575] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors" onClick={onClose}>Cancelar</button>
             <button className="flex-1 bg-[#6C63FF] text-white py-3 rounded-xl font-bold hover:bg-[#5b54d6] shadow-md hover:shadow-lg transition-all" onClick={() => { alert('¡Tutoría Agendada!'); onClose(); }}>Reservar</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ViewChat = ({ setCurrentView, globalUser }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [draft, setDraft] = React.useState('');

  const handleIncomingMessage = (rawMsg) => {
    try {
      const msg = JSON.parse(rawMsg);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: msg.content || rawMsg,
        me: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), text: rawMsg, me: false, time: "Ahora" }]);
    }
  };

  // Conectamos WebSockets usando un user hipotético o el logueado
  const { isConnected, sendMessage } = useChatWebSocket(globalUser?.id || "anonymous", handleIncomingMessage);

  // Id de un tutor destino falso por defecto para pruebas
  const targetId = "11111111-1111-1111-1111-111111111111";

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: draft,
      me: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    sendMessage(targetId, draft);
    setDraft('');
  };
  return (
    <div className="flex h-[calc(100vh-5rem)] -mx-6 md:-mx-10 w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] overflow-hidden bg-white -mt-8 border-t border-gray-100 animate-fade-in">
      
      {/* Sidebar Lista de Chats */}
      <div className="w-full md:w-80 lg:w-[350px] border-r border-gray-100 flex flex-col bg-white shrink-0 hidden md:flex z-10">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1A1A2E] text-xl mb-4 px-2">Mensajes</h2>
          <div className="flex items-center bg-[#F3F4F6] rounded-xl px-4 py-2.5 w-full focus-within:bg-white focus-within:border-[#6C63FF] focus-within:ring-1 focus-within:ring-[#6C63FF] border border-transparent transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar conversacion..." className="bg-transparent border-none outline-none text-sm w-full ml-2 text-[#1A1A2E]" />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Chat Activo */}
          <div className="flex items-center gap-3 p-4 bg-[#F0F5FF] border-l-[3px] border-[#6C63FF] cursor-pointer transition-colors relative">
            <Avatar initials="DP" bg="bg-[#6C63FF]" online={true} className="w-12 h-12" />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-[#1A1A2E] text-[15px]">Daniel Pérez</span>
                <span className="text-[11px] font-semibold text-[#6C63FF]">13:34</span>
              </div>
              <p className="text-[13px] text-[#6C63FF] font-medium truncate">Hasta mañana. ¡Gracias!</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#6C63FF] rounded-full"></div>
          </div>
          
          {/* Chat Inactivo */}
          <div className="flex items-center gap-3 p-4 border-l-[3px] border-transparent cursor-pointer hover:bg-[#F9FAFB] border-b border-gray-50 transition-colors">
            <Avatar initials="JR" bg="bg-[#6C63FF]" online={false} className="w-12 h-12" />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-[#1A1A2E] text-[15px]">Javier Ríos</span>
                <span className="text-[11px] text-[#9E9E9E] font-medium">Ayer</span>
              </div>
              <p className="text-[13px] text-[#757575] truncate">¿Podrás revisar el PDF que envié?</p>
            </div>
          </div>
          
          {/* Chat Inactivo */}
          <div className="flex items-center gap-3 p-4 border-l-[3px] border-transparent cursor-pointer hover:bg-[#F9FAFB] border-b border-gray-50 transition-colors">
            <Avatar initials="SM" bg="bg-[#FF6B35]" online={true} className="w-12 h-12" />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-[#1A1A2E] text-[15px]">Sofia Martinez</span>
                <span className="text-[11px] text-[#9E9E9E] font-medium">Lun</span>
              </div>
              <p className="text-[13px] text-[#757575] truncate">Excelente la clase de diseño.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Area principal Chat Individual */}
      <div className="flex-1 flex flex-col bg-[#F8F9FE] relative w-full h-full">
        {/* Header Chat */}
        <div className="h-[76px] border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
             <button onClick={() => setCurrentView('home')} className="md:hidden text-[#1A1A2E] hover:text-[#6C63FF] transition-colors bg-gray-50 p-2 rounded-xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
             <Avatar initials="DP" bg="bg-[#6C63FF]" className="w-11 h-11" online={true} />
             <div className="flex flex-col justify-center">
               <span className="font-bold text-[#1A1A2E] text-base leading-none mb-1">Daniel Pérez</span>
               <span className="text-xs text-[#4CAF50] font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full inline-block"></span> En línea</span>
             </div>
          </div>
          <div className="flex items-center gap-3 text-[#9E9E9E]">
            <button onClick={() => alert('Llamada iniciada (Mock)')} className="hover:text-[#6C63FF] hover:bg-indigo-50 p-2 rounded-xl transition-all text-gray-500"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></button>
            <button onClick={() => alert('Videollamada iniciada (Mock)')} className="hover:text-[#6C63FF] hover:bg-indigo-50 p-2 rounded-xl transition-all text-gray-500"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => setModalOpen(true)} className="ml-1 bg-[#6C63FF] text-white hover:bg-[#5b54d6] px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 
              <span className="hidden sm:inline">Agendar</span>
            </button>
          </div>
        </div>

        {/* Burbujas Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-5 custom-scrollbar">
          <div className="flex items-center justify-center my-2">
            <span className="bg-gray-200/60 text-[#757575] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hoy</span>
          </div>
          
          <div className="flex items-center justify-center -mt-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
              {isConnected ? 'API WebSockets Conectado' : 'Desconectado'}
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.me ? 'justify-end' : 'justify-start gap-3'} group`}>
              {!msg.me && <Avatar initials="DP" bg="bg-[#6C63FF]" className="w-8 h-8 mt-auto shrink-0 hidden sm:flex" />}
              <div className="max-w-[85%] md:max-w-[70%]">
                <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.me ? 'bg-[#6C63FF] text-white rounded-tr-sm relative' : 'bg-white border border-gray-200/60 text-[#1A1A2E] rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]'}`}>
                  <p className="text-[14.5px] leading-relaxed">{msg.text}</p>
                  
                  {!msg.me && msg.img && (
                    <div className="rounded-xl overflow-hidden mt-4 mb-1 ring-1 ring-black/5">
                      <img src={msg.img} alt="Lugar" className="w-full object-cover h-36 hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                  )}
                </div>
                
                <div className={`text-[11px] font-medium text-[#9E9E9E] mt-1.5 px-1 ${msg.me ? 'text-right flex items-center justify-end gap-1' : 'text-left'}`}>
                  {msg.time}
                  {msg.me && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Composer */}
        <div className="bg-white border-t border-gray-200/80 px-4 py-4 md:px-6 shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
            <button onClick={() => alert('Adjuntar archivo (Mock)')} className="p-2.5 text-[#9E9E9E] hover:text-[#6C63FF] hover:bg-gray-100 rounded-full transition-all shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
            <div className="flex-1 bg-[#F3F4F6] rounded-2xl flex items-end px-2 border-2 border-transparent focus-within:border-[#6C63FF]/30 focus-within:bg-white transition-all">
              <textarea 
                placeholder="Escribe un mensaje..." 
                className="w-full bg-transparent border-none outline-none text-[14.5px] text-[#1A1A2E] py-3.5 px-2 resize-none max-h-32 min-h-[48px] custom-scrollbar"
                rows="1"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              ></textarea>
              <button onClick={() => alert('Enviar foto (Mock)')} className="p-2.5 text-[#9E9E9E] hover:text-[#6C63FF] transition-colors shrink-0 mb-0.5"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></button>
            </div>
            <button onClick={handleSend} className="bg-[#6C63FF] text-white w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#5b54d6] transition-all shrink-0 pl-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <ScheduleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
// --- End Components Step 6 --- //

// --- Interacción con Backend (Paso 7: API & WebSockets) --- //
const API_URL = "http://localhost:8000";

const api = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Error en login api real");
        const data = await res.json();
        // Guardar token real
        localStorage.setItem("ttp_token", data.access_token);
        return data;
      } catch (e) {
        console.warn("Usando mock login de fallback...", e.message);
        // Fallback si Docker/Backend no está levantado
        return { access_token: "mock_token_123", user: { name: "Usuario Mock", email } };
      }
    },
    register: async (data) => {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error en registro api real");
        const responseData = await res.json();
        localStorage.setItem("ttp_token", responseData.access_token);
        return responseData;
      } catch (e) {
        console.warn("Usando mock register de fallback...", e.message);
        return { id: 1, ...data };
      }
    },
    getTutors: async () => {
      try {
        const res = await fetch(`${API_URL}/tutors/tutors/`);
        if (!res.ok) throw new Error("Error fetching tutors");
        const data = await res.json();
        
        // Formatear los datos reales para que encajen con lo que espera la UI (colores, posts)
        return data.tutors.map((t, index) => {
           const colors = ['bg-[#6C63FF]', 'bg-[#FF6B35]', 'bg-[#4CAF50]', 'bg-[#00BCD4]', 'bg-[#E91E63]'];
           const hexColors = ['#6C63FF', '#FF6B35', '#4CAF50', '#00BCD4', '#E91E63'];
           const idx = index % colors.length;
           
           // Generar un nombre temporal bonito basado en el índice
           const fallbackNames = ["Daniel", "Sofia", "Javier", "Laura", "Carlos", "Ana", "Miguel", "Lucia", "Elena", "Roberto"];
           const lastName = ["Gómez", "Martínez", "Ríos", "Zapata", "López", "Méndez"];
           const name = fallbackNames[index % fallbackNames.length] + " " + lastName[index % lastName.length];
           
           return {
             id: t.id,
             user_id: t.user_id,
             name: name,
             role: t.specialties ? t.specialties[0] || 'Experto' : "Tutor General",
             fullRole: t.categories ? t.categories.join(", ") : 'Desarrollo & Ciencias',
             initials: name.substring(0,2).toUpperCase(),
             bg: colors[idx],
             color: hexColors[idx],
             // Si la API no tiene longitud, poner coordenadas cerca a Medellín
             lat: t.lat || (6.24 + (Math.random() * 0.05 - 0.025)), 
             lng: t.lng || (-75.58 + (Math.random() * 0.05 - 0.025)),
             rate: t.hourly_rate,
             experience: t.years_experience || 1,
             likes: Math.floor(Math.random() * 50) + 5,
             comments: Math.floor(Math.random() * 20) + 1,
             specialties: t.specialties || ["Matemáticas", "Ciencias"]
           };
        });
      } catch (e) {
         console.warn("Usando mock tutors de fallback...", e.message);
         // Fallback por si muere el servicio
         return [
            { id: 1, name: 'Daniel Pérez', role: 'Matemáticas', initials: 'DP', bg: 'bg-[#6C63FF]', color: '#6C63FF', lat: 6.24, lng: -75.58, likes:25, comments:8, specialties: ['Álgebra'] },
            { id: 2, name: 'Sofia Martinez', role: 'Diseño Gráfico', initials: 'SM', bg: 'bg-[#FF6B35]', color: '#FF6B35', lat: 6.25, lng: -75.59, likes:42, comments:12, specialties: ['UI/UX'] },
            { id: 3, name: 'Javier Ríos', role: 'Inglés', initials: 'JR', bg: 'bg-[#6C63FF]', color: '#6C63FF', lat: 6.23, lng: -75.56, likes:15, comments:3, specialties: ['Gramática'] },
         ];
      }
    },
    getProfile: async (userId) => {
      try {
        const endpoint = userId ? `/users/profiles/${userId}` : `/users/profiles/me`;
        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem("ttp_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, { headers });
        if (!res.ok) throw new Error("Error fetching profile");
        return await res.json();
      } catch (e) {
        console.warn("Mock profile fallback...", e.message);
        return { 
           display_name: userId ? "Tutor #" + String(userId).substring(0,4) : "Laura García",
           bio: "Hola, soy un tutor apasionado por la enseñanza y dispuesto a ayudarte a alcanzar tus metas académicas rápidamente.",
           location_name: "Colombia",
           user_id: userId
        };
      }
    }
  };

  const useChatWebSocket = (userId, onMessageReceived) => {
    const [socket, setSocket] = React.useState(null);
    const [isConnected, setIsConnected] = React.useState(false);

    React.useEffect(() => {
      const token = localStorage.getItem("ttp_token");
      if (!userId || !token) return;

      // Conectando a través del API Gateway pasando el JWT en la query
      const wsUrl = `ws://localhost:8000/chat/ws?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WS Conectado al backend real (Gateway -> Chat Service)');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        console.log('WS Mensaje recibido:', event.data);
        if (onMessageReceived) {
          onMessageReceived(event.data);
        }
      };

      ws.onclose = () => {
        console.log('WS Desconectado');
        setIsConnected(false);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }, [userId]);

    const sendMessage = (receiverId, msgText) => {
      if (socket && isConnected) {
        socket.send(JSON.stringify({ 
           conversation_id: "00000000-0000-0000-0000-000000000000",
           receiver_id: receiverId,
           content: msgText 
        }));
      } else {
        console.warn("WS no conectado, mensaje ignorado.");
      }
    };

    return { isConnected, sendMessage };
  };
// --- Fin Interacción Backend --- //

const App = () => {
  const [currentView, setCurrentView] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [globalUser, setGlobalUser] = useState(null);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
  
    React.useEffect(() => {
      // Intentar auto-login si ya hay un token (opcional, solo visual por ahora)
      const token = localStorage.getItem("ttp_token");
      if (token && !isLoggedIn) {
        setIsLoggedIn(true);
      }
    }, [isLoggedIn]);

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <ViewLogin setCurrentView={setCurrentView} setGlobalUser={setGlobalUser} setIsLoggedIn={setIsLoggedIn} />;
      case 'register':
        return <ViewRegister setCurrentView={setCurrentView} setGlobalUser={setGlobalUser} setIsLoggedIn={setIsLoggedIn} />;
      case 'map':
        return <ViewMap setCurrentView={setCurrentView} setSelectedProfileId={setSelectedProfileId} />;
      case 'chat':
        return <ViewChat setCurrentView={setCurrentView} globalUser={globalUser} />;
      case 'profile':
        return <ViewProfile setCurrentView={setCurrentView} selectedProfileId={selectedProfileId} globalUser={globalUser} />;
      case 'home':
      default:
        return <ViewHome setCurrentView={setCurrentView} setSelectedProfileId={setSelectedProfileId} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#E8EAF6] text-[#1A1A2E] font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col items-center w-24 bg-white shadow-lg py-8 justify-between z-20">
        <div className="flex flex-col items-center gap-6">
          <div className="cursor-pointer mb-6 hover:scale-105 transition-transform" onClick={() => setCurrentView('home')}>
            <IconLogo />
          </div>
          <IconMap active={currentView === 'map'} onClick={() => setCurrentView('map')} />
          <IconSearch active={currentView === 'home'} onClick={() => setCurrentView('home')} />
          <IconChat active={currentView === 'chat'} onClick={() => setCurrentView('chat')} />
        </div>
        <div className="flex flex-col items-center gap-6">
          <IconProfile active={currentView === 'profile'} onClick={() => { setSelectedProfileId(null); setCurrentView('profile'); }} />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative w-full">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between px-6 md:px-10 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <div className="md:hidden cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentView('home')}>
              <IconLogo />
            </div>
            <span className="font-bold text-2xl hidden md:block tracking-tight">TutorMatch</span>
            <span className="text-[#9E9E9E] font-medium text-sm border-l-2 border-gray-100 pl-4 ml-2 hidden sm:block w-32 truncate">
              {currentView === 'home' && 'Feed Principal'}
              {currentView === 'map' && 'Explorar Mapa'}
              {currentView === 'chat' && 'Mensajes Recientes'}
              {currentView === 'profile' && 'Perfil de Usuario'}
              {currentView === 'login' && 'Iniciar Sesión'}
              {currentView === 'register' && 'Crea tu Cuenta'}
            </span>
            
            {/* Search Bar for Top Navbar */}
            {currentView !== 'login' && currentView !== 'register' && (
              <div className="hidden lg:flex items-center bg-[#E8EAF6]/50 border border-gray-100 rounded-xl px-4 py-2 w-64 xl:w-96 transition-all focus-within:bg-white focus-within:border-[#6C63FF] focus-within:ring-1 focus-within:ring-[#6C63FF] ml-4 md:ml-8">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="¿Qué buscas?" className="bg-transparent border-none outline-none text-sm w-full ml-3 text-[#1A1A2E]" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="text-[#757575] hover:text-[#6C63FF] font-medium transition px-2"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className="bg-[#6C63FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 hover:shadow-lg transition-all"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                <div className="relative cursor-pointer">
                  <IconBell active={false} onClick={() => {}} />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
                <div 
                  onClick={() => setCurrentView('profile')}
                  className="w-11 h-11 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-md transition shadow-sm text-lg"
                >
                  LG
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8">
          {renderView()}
        </main>

        {/* Mobile Bottom Navbar */}
        <nav className="md:hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around px-6 pb-4 pt-3 z-20 shrink-0 rounded-t-2xl">
          <IconSearch active={currentView === 'home'} onClick={() => setCurrentView('home')} />
          <IconMap active={currentView === 'map'} onClick={() => setCurrentView('map')} />
          <IconChat active={currentView === 'chat'} onClick={() => setCurrentView('chat')} />
          <IconProfile active={currentView === 'profile'} onClick={() => { setSelectedProfileId(null); setCurrentView('profile'); }} />
          <IconMenu active={false} onClick={() => {}} />
        </nav>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
