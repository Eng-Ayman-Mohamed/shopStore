import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinkStyle = {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: 14,
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const socialIconStyle = {
    width: 40,
    height: 40,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: 18,
    transition: "all 0.2s ease",
  };

  const sectionTitleStyle = {
    fontWeight: 800,
    marginBottom: 12,
    fontSize: 16,
  };

  return (
    <footer className="footer">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32,
          marginBottom: 32,
        }}
      >
        {/* Brand Section */}
        <div>
          <div
            style={{
              ...sectionTitleStyle,
              background:
                "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Colorful Shop™
          </div>
          <div className="small" style={{ lineHeight: 1.6 }}>
            Premium apparel and accessories for those who dare to stand out.
            Vibrant. Bold. You.
          </div>
        </div>

        {/* Shop Section */}
        <div>
          <div
            style={{
              ...sectionTitleStyle,
              color: "var(--accent-cyan)",
            }}
          >
            Shop
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              to="/shop"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-cyan)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              All Products
            </Link>
            <Link
              to="/shop"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-cyan)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              New Arrivals
            </Link>
            <a
              href="#"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-cyan)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              Sale
            </a>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <div
            style={{
              ...sectionTitleStyle,
              color: "var(--accent-purple)",
            }}
          >
            Support
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a
              href="#"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-purple)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              Help Center
            </a>
            <a
              href="#"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-purple)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              Contact Us
            </a>
            <a
              href="#"
              style={footerLinkStyle}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--accent-purple)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              Returns
            </a>
          </div>
        </div>

        {/* Connect Section */}
        <div>
          <div
            style={{
              ...sectionTitleStyle,
              color: "var(--accent-pink)",
            }}
          >
            Connect
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <a
              href="#"
              style={{
                ...socialIconStyle,
                background: "rgba(244, 114, 182, 0.1)",
                border: "1px solid rgba(244, 114, 182, 0.2)",
                color: "var(--accent-pink)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(244, 114, 182, 0.2)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(244, 114, 182, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              𝕏
            </a>
            <a
              href="#"
              style={{
                ...socialIconStyle,
                background: "rgba(0, 215, 255, 0.1)",
                border: "1px solid rgba(0, 215, 255, 0.2)",
                color: "var(--accent-cyan)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 215, 255, 0.2)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0, 215, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              f
            </a>
            <a
              href="#"
              style={{
                ...socialIconStyle,
                background: "rgba(167, 139, 250, 0.1)",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                color: "var(--accent-purple)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(167, 139, 250, 0.2)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(167, 139, 250, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              📷
            </a>
          </div>
          <div className="small">Follow for updates & drops</div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        style={{
          borderTop: "1px solid var(--card-border)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div className="small">© 2025 Colorful Shop. All rights reserved.</div>
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <a
            href="#"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent-cyan)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Privacy
          </a>
          <a
            href="#"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent-cyan)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Terms
          </a>
          <a
            href="#"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent-cyan)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}
