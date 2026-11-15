import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import SubmitManuscript from './pages/SubmitManuscript';
import Dashboard from './pages/Dashboard';
import Publications from './pages/Publications';
import About from './pages/About';
import Login from './pages/Login';
import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import TrackManuscript from './pages/TrackManuscript';
import PaperReaderPage from './pages/PaperReaderPage';
import KnowledgeGalaxy from './components/KnowledgeGalaxy';
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { 
  BookOpen, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Globe2,
  PenTool,
  TrendingUp,
  FileText,
  Mail,
  Quote,
  CheckCircle2,
  Atom,
  Microscope,
  Leaf,
  Stethoscope,
  Building2,
  Users,
  MessageSquare,
  ShoppingCart,
  ChevronDown
} from 'lucide-react';

function Header() {
  const user = localStorage.getItem('user');
  const { setIsCartOpen, cartCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo-link" style={{display: 'flex', alignItems: 'center'}}>
            <img src="/logo.png" alt="Vowles Publications" style={{ height: '55px', width: 'auto' }} />
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/journals" className="nav-link">Journals</Link>
            <Link to="/publications" className="nav-link">Publications</Link>
            <Link to="/track" className="nav-link">Track Paper</Link>
            <Link to="/submit" className="nav-link">Publish with us</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
          <div className="header-actions">
            {user ? (
              <button onClick={handleLogout} className="login-link" style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>Log out ({user.split('@')[0]})</button>
            ) : (
              <Link to="/login" className="login-link">Log in</Link>
            )}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="cart-link" 
              style={{position: 'relative', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
              title="View Cart"
            >
              <ShoppingCart size={20} color="var(--text-muted)"/>
              <span className="cart-badge">{cartCount}</span>
            </button>
            <Link to="/submit" className="btn btn-primary">Submit Manuscript</Link>
          </div>
        </div>
      </header>
    </>
  );
}

function Home() {
  const [publishedPapers, setPublishedPapers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        const accepted = data.filter(paper => paper.status === 'Accepted');
        setPublishedPapers(accepted.slice(0, 3)); // Show latest 3
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="badge badge-yellow">Journal Publishing Platform</span>
              <h1>
                Where rigorous <br />
                ideas find <br />
                their audience.
              </h1>
              <p>
                Vowles Publications is a premium open-access publication platform dedicated to accelerating scientific discovery through rigorous peer review and rapid publication.
              </p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = e.target.searchQuery.value;
                  window.location.href = `/publications?q=${encodeURIComponent(q)}`;
                }}
                className="hero-search-box" 
                style={{display: 'flex', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '9999px', padding: '0.25rem', marginBottom: '2rem', maxWidth: '500px'}}
              >
                <select className="search-select" style={{background: 'transparent', color: 'var(--text-muted)', border: 'none', borderRight: '1px solid var(--card-border)', padding: '0 1rem', outline: 'none'}}>
                  <option>Search Articles</option>
                  <option>Search Journals</option>
                  <option>Search Keywords</option>
                </select>
                <input name="searchQuery" type="text" placeholder="Search DOIs, authors, titles..." style={{flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0 1rem', outline: 'none'}} />
                <button type="submit" className="btn btn-primary" style={{borderRadius: '9999px', padding: '0.5rem 1rem'}}><Search size={16}/></button>
              </form>

              <div className="hero-actions">
                <Link to="/submit" className="btn btn-primary">
                  Submit Manuscript <ArrowRight size={16} />
                </Link>
                <Link to="/journals" className="btn btn-outline">
                  Explore Journals <ArrowRight size={16} />
                </Link>
              </div>
              <div className="trusted-by">
                <div className="avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                Trusted by researchers from over 100+ institutions.
              </div>
            </div>
            
            <div className="hero-card">
              <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800" alt="Researcher at desk" />
              <div className="hero-card-content">
                <span className="badge badge-blue" style={{marginBottom: '0.5rem'}}>Open Access</span>
                <h3>Exclusive features in a stunning world</h3>
                <p>Read from the world's most brilliant minds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="container">
        <div className="stats-bar">
          <div className="stat-item">
            <h3>1,000+</h3>
            <p>Peer reviewers</p>
          </div>
          <div className="stat-item">
            <h3>450+</h3>
            <p>Published papers</p>
          </div>
          <div className="stat-item">
            <h3>5M+</h3>
            <p>Monthly citations</p>
          </div>
          <div className="stat-item">
            <h3>99%</h3>
            <p>Open access rate</p>
          </div>
        </div>
      </div>

      {/* 3D Interactive Knowledge Galaxy Section */}
      <section className="section" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="section-header-split" style={{ marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-yellow">Interactive 3D Citation Cosmos</span>
              <h2>Explore the Knowledge Galaxy</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '640px' }}>
                Traverse connected scientific breakthroughs across AI, Biotechnology, Medicine, and Materials Science in our live 3D orbital constellation.
              </p>
            </div>
            <div>
              <Link to="/publications" className="btn btn-outline">
                View Full Catalog <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <KnowledgeGalaxy onSelectPaper={(p) => window.location.href = `/read/${p.id || 1}`} />
        </div>
      </section>

      {/* Categories */}
      <div className="container">
        <div className="category-pills">
          <div className="pill active">View All</div>
          <div className="pill">Art</div>
          <div className="pill">Humanities</div>
          <div className="pill">Social Sciences</div>
          <div className="pill">Medical</div>
        </div>
      </div>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-header-center">
            <span className="badge badge-yellow">Our Approach</span>
            <h2>Scholarship deserves a <br/> better publishing experience.</h2>
            <p>We built a platform that puts researchers first. Vowles Publications empowers you to focus on the science while we ensure it reaches the world.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper"><ShieldCheck size={20} /></div>
              <h3>Leading peer review</h3>
              <p>Our esteemed editorial board ensures the highest quality standards through double-blind peer review.</p>
              <a href="#" className="feature-link"><PenTool size={14}/> View review policies</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Globe2 size={20} /></div>
              <h3>Global discoverability</h3>
              <p>Open access ensures your research is freely available worldwide, maximizing citations and academic influence.</p>
              <a href="#" className="feature-link"><Globe2 size={14}/> See indexing metrics</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><PenTool size={20} /></div>
              <h3>Editorial craft</h3>
              <p>We format, typeset, and perfect your manuscript to ensure it meets global publication standards.</p>
              <a href="#" className="feature-link"><FileText size={14}/> Formatting guide</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><TrendingUp size={20} /></div>
              <h3>Moving full impact</h3>
              <p>Accelerate your research impact. Our streamlined workflow aims for a first decision within 14 days.</p>
              <a href="#" className="feature-link"><TrendingUp size={14}/> View impact factors</a>
            </div>
          </div>
        </div>
      </section>

      {/* Journals Impacting Science */}
      <section className="section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="badge badge-yellow">Top Ranked</span>
              <h2>Journals Impacting Science</h2>
              <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Discover our highest-impact journals leading global research discussions.</p>
            </div>
            <button className="btn btn-outline">View Journals Catalog <ArrowRight size={16}/></button>
          </div>

          <div className="pubs-grid">
            <div className="pub-card" style={{display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center'}}>
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300" alt="Cover" style={{width: '100px', height: '140px', objectFit: 'cover', borderRadius: '0.5rem'}}/>
              <div>
                <h3 style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>Current Medical Informatics</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem'}}>Impact Factor: <strong style={{color: 'white'}}>6.1</strong></p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>5-Year Impact: <strong style={{color: 'white'}}>7.7</strong></p>
                <button className="btn btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.8rem'}}>Subscribe</button>
              </div>
            </div>
            
            <div className="pub-card" style={{display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center'}}>
              <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=300" alt="Cover" style={{width: '100px', height: '140px', objectFit: 'cover', borderRadius: '0.5rem'}}/>
              <div>
                <h3 style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>Reviews in Gene Therapy</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem'}}>Impact Factor: <strong style={{color: 'white'}}>4.1</strong></p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>5-Year Impact: <strong style={{color: 'white'}}>5.2</strong></p>
                <button className="btn btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.8rem'}}>Subscribe</button>
              </div>
            </div>

            <div className="pub-card" style={{display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center'}}>
              <img src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=300" alt="Cover" style={{width: '100px', height: '140px', objectFit: 'cover', borderRadius: '0.5rem'}}/>
              <div>
                <h3 style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>Nanomaterials & Tech</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem'}}>Impact Factor: <strong style={{color: 'white'}}>5.0</strong></p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>5-Year Impact: <strong style={{color: 'white'}}>5.3</strong></p>
                <button className="btn btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.8rem'}}>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Publications */}
      <section className="section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="badge badge-yellow">Publications</span>
              <h2>Latest publications</h2>
              <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Explore our open-access catalog, updated hourly with groundbreaking research.</p>
            </div>
            <button className="btn btn-outline">View all publications <ArrowRight size={16}/></button>
          </div>

          <div className="pubs-grid">
            {publishedPapers.length > 0 ? publishedPapers.map((paper) => (
              <div className="pub-card" key={paper.id}>
                <div style={{height: '200px', background: 'linear-gradient(45deg, var(--primary-blue), #8b5cf6)', position: 'relative', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', bottom: '0', left: '0', right: '0', top: '0', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0.5}}>
                    <BookOpen size={48} />
                  </div>
                </div>
                <div className="pub-content">
                  <div className="pub-tags">
                    <span className="badge badge-blue">New Release</span>
                    <span className="badge badge-green">Open Access</span>
                  </div>
                  <h3>{paper.title}</h3>
                  <p className="pub-author">{paper.authors}</p>
                  <p className="pub-desc" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{paper.abstract}</p>
                  <a href={`http://localhost:3001/api/downloads/${paper.filename}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{marginTop: '1rem', width: '100%', justifyContent: 'center', fontSize: '0.85rem'}}>Read Full Paper</a>
                </div>
              </div>
            )) : (
              <p style={{color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem'}}>No publications available yet. Accept a manuscript in the dashboard to see it here!</p>
            )}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="section">
        <div className="container">
          <div className="promo-grid">
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" alt="Meeting" className="promo-image" />
            <div className="promo-content">
              <span className="badge badge-yellow">Publishing Ethos</span>
              <h2>Careful publishing for consequential ideas.</h2>
              <p>Our editorial team ensures that every submission receives the attention it deserves, polishing your manuscript without compromising your voice.</p>
              
              <ul className="promo-list">
                <li className="promo-list-item">
                  <CheckCircle2 className="icon" size={20} />
                  <div>
                    <h4>Personal integrity</h4>
                    <p>We maintain absolute transparency in our review and pricing models.</p>
                  </div>
                </li>
                <li className="promo-list-item">
                  <CheckCircle2 className="icon" size={20} />
                  <div>
                    <h4>Rapid approvals</h4>
                    <p>Fast-tracked editorial workflows for time-sensitive discoveries.</p>
                  </div>
                </li>
              </ul>
              <button className="btn btn-outline" style={{marginTop: '2rem'}}>Read our editorial guidelines <ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
      </section>

      {/* Topics / Journals */}
      <section className="section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="badge badge-yellow">Explore Topics</span>
              <h2>Ideas meet at the edges.</h2>
              <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Discover cross-disciplinary research spanning the boundaries of traditional science.</p>
            </div>
            <button className="btn btn-outline">View all topics <ArrowRight size={16}/></button>
          </div>

          <div className="topics-grid">
            <div className="topic-card">
              <div className="topic-icon"><Stethoscope size={24}/></div>
              <div className="topic-content">
                <h4>Medical Sciences</h4>
                <p>Clinical trials, immunology, and public health.</p>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon"><Leaf size={24}/></div>
              <div className="topic-content">
                <h4>Earth Sciences</h4>
                <p>Climate change, geology, and environmental policy.</p>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon"><Users size={24}/></div>
              <div className="topic-content">
                <h4>Social Sciences</h4>
                <p>Psychology, sociology, and human behavior.</p>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon"><Atom size={24}/></div>
              <div className="topic-content">
                <h4>Physical Sciences</h4>
                <p>Quantum mechanics, astrophysics, and chemistry.</p>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon"><Microscope size={24}/></div>
              <div className="topic-content">
                <h4>Research Methodology</h4>
                <p>Statistical models, data science, and protocols.</p>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon"><Building2 size={24}/></div>
              <div className="topic-content">
                <h4>Urban Development</h4>
                <p>Architecture, city planning, and infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="badge badge-yellow">Workflow</span>
              <h2>A clear path from <br/> manuscript to momentum.</h2>
              <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>We handle the logistics so you can focus on the research. Our transparent process keeps you updated at every step.</p>
            </div>
            <Link to="/submit" className="btn btn-yellow">Submit Manuscript <ArrowRight size={16}/></Link>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon"><FileText size={18}/></div>
              <h4>Submit with confidence</h4>
              <p>Upload your paper securely. Our automated system checks for formatting and ethics compliance.</p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon"><MessageSquare size={18}/></div>
              <h4>Review with purpose</h4>
              <p>Your paper is matched with domain experts for constructive, double-blind peer review.</p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon"><PenTool size={18}/></div>
              <h4>Refine with care</h4>
              <p>Work directly with our editors to address feedback and polish the final manuscript.</p>
            </div>
            <div className="step-card">
              <span className="step-number">04</span>
              <div className="step-icon"><Globe2 size={18}/></div>
              <h4>Publish the work</h4>
              <p>Your research is instantly available globally, fully indexed and assigned a DOI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section">
        <div className="container">
          <div className="test-grid">
            <div className="test-image-card">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Author" />
            </div>
            <div className="test-quote-card">
              <span className="badge badge-yellow" style={{alignSelf: 'flex-start'}}>Author Perspective</span>
              <Quote size={40} style={{color: 'var(--card-border)', marginTop: '2rem'}} />
              <h2>"Vowles Publications felt like a superpower for my research. The review cycle was rigorous, and the editorial team truly amplified my voice."</h2>
              <div className="test-author">
                <div className="test-author-info">
                  <h4>Dr. Jonathan Chen</h4>
                  <p>Lead Researcher, Institute of Neurology</p>
                </div>
              </div>
            </div>
            <div className="test-score-card">
              <div className="score-box">
                <span className="badge badge-blue">Author Satisfaction</span>
                <h2 style={{marginTop: '1rem'}}>9.4 <span style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>/ 10</span></h2>
                <p>Based on post-publication surveys from 1,200+ authors in 2026.</p>
                <a href="#" style={{color: 'var(--primary-blue)', fontSize: '0.85rem', marginTop: '1rem', display: 'inline-block'}}>Read the report</a>
              </div>
              <div className="cta-box" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                <MessageSquare size={32} style={{color: 'var(--primary-blue)', marginBottom: '1rem'}} />
                <h4>Questions about the process?</h4>
                <p>Our support team is here to help.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="section">
        <div className="container">
          <div className="subscribe-section">
            <span className="badge badge-yellow">Newsletter</span>
            <h2>The week's most worthwhile research, in context.</h2>
            <p>Join thousands of researchers who receive our curated highlights every Monday.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Email address" className="subscribe-input" />
              <button className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>Subscribe <ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="/" className="logo-link" style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                <img src="/logo.png" alt="Vowles Publications" style={{ height: '55px', width: 'auto' }} />
              </a>
              <p>Building the future of open-access scientific publishing, one breakthrough at a time.</p>
              <div className="footer-social" style={{marginTop: '1.5rem'}}>
                <a href="#" style={{color: 'var(--text-muted)'}}>Twitter</a>
                <a href="#" style={{color: 'var(--text-muted)'}}>LinkedIn</a>
                <a href="#" style={{color: 'var(--text-muted)'}}>Facebook</a>
              </div>
            </div>
            <div>
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about">Careers</Link></li>
                <li><Link to="/about">Press</Link></li>
                <li><Link to="/about">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><Link to="/submit">Author Guidelines</Link></li>
                <li><Link to="/dashboard">Reviewer Portal</Link></li>
                <li><Link to="/about">API Documentation</Link></li>
                <li><Link to="/about">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><Link to="/about">Privacy Policy</Link></li>
                <li><Link to="/about">Terms of Service</Link></li>
                <li><Link to="/about">Cookie Policy</Link></li>
                <li><Link to="/about">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Vowles Publications. All rights reserved.</span>
            <div style={{display: 'flex', gap: '1.5rem'}}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const ProtectedRoute = ({ children, requireAdmin }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requireAdmin && user !== 'admin@vowles.com') {
    return <Navigate to="/publications" />;
  }
  return children;
};

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="glow-bg glow-purple"></div>
        <div className="glow-bg glow-blue"></div>
        <CartDrawer />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/journals" element={<Journals />} />
          <Route path="/journals/:journalId" element={<JournalDetail />} />
          <Route path="/track" element={<TrackManuscript />} />
          <Route path="/read/:paperId" element={<PaperReaderPage />} />
          
          {/* Protected Routes */}
          <Route path="/submit" element={<ProtectedRoute><SubmitManuscript /></ProtectedRoute>} />
          <Route path="/publications" element={<ProtectedRoute><Publications /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}
