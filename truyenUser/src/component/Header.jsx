export default function Header() {
    return (
      <header style={{ background: '#394247', padding: '10px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="https://static.truyenchu.com.vn/images/logo_long.png?v=1&auto=format&fit=max&w=256" alt="TruyenChu logo" style={{height:40, objectFit: 'contain'}} />
          <span style={{color: '#fafaf8', fontWeight: 700, fontSize: 22, fontFamily:'sans-serif', letterSpacing:2}}>TRUYỆN CHỮ</span>
        </div>
      </header>
    );
  }
  