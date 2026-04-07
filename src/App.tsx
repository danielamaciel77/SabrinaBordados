/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Instagram, MessageCircle, ChevronRight, Heart, Camera, Plus } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";

interface ProductImageProps {
  id: string;
  className?: string;
  label?: string;
  aspect?: string;
}

const ProductImage = ({ id, className, label, aspect = "aspect-square" }: ProductImageProps) => {
  const [image, setImage] = useState<string | null>(() => {
    // Tenta carregar a imagem salva no localStorage ao iniciar
    try {
      return localStorage.getItem(`sb_image_${id}`);
    } catch (e) {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verifica se o arquivo não é muito grande (limite de ~2MB para localStorage)
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem é muito grande. Tente uma foto menor para que ela possa ser salva no navegador.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        try {
          localStorage.setItem(`sb_image_${id}`, base64String);
        } catch (err) {
          console.error("Erro ao salvar no localStorage:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleClick}
      className={`p-1.5 bg-[#d9c5b2] border border-gold/50 rounded-2xl shadow-md cursor-pointer group relative ${className} ${aspect}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="w-full h-full bg-stone-50 border border-gold/20 flex flex-col items-center justify-center overflow-hidden rounded-xl relative">
        {image ? (
          <img 
            src={image} 
            alt={label || "Produto"} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-gold mb-1">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-stone-400 text-[9px] font-medium uppercase tracking-widest leading-tight">
              {label || "Adicionar Foto"}
            </span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-gold/40" />
        </div>
      </div>
    </motion.div>
  );
};

interface CatalogItemProps {
  id: string;
}

const CatalogItem = ({ id }: CatalogItemProps) => {
  const [image, setImage] = useState<string | null>(() => {
    try { return localStorage.getItem(`sb_cat_img_${id}`); } catch { return null; }
  });
  const [description, setDescription] = useState(() => {
    try { return localStorage.getItem(`sb_cat_desc_${id}`) || ""; } catch { return ""; }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Imagem muito grande.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        localStorage.setItem(`sb_cat_img_${id}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);
    localStorage.setItem(`sb_cat_desc_${id}`, val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-3"
    >
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 bg-[#d9c5b2] border border-gold/50 rounded-2xl shadow-md cursor-pointer relative aspect-square group"
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <div className="w-full h-full bg-stone-50 border border-gold/20 flex items-center justify-center overflow-hidden rounded-xl relative">
          {image ? (
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            <Plus className="w-6 h-6 text-gold/40" />
          )}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-gold" />
          </div>
        </div>
      </div>
      
      <div className="space-y-1 px-1">
        <input 
          type="text" 
          value={description} 
          onChange={handleDescChange}
          placeholder="Descrição do produto..."
          className="w-full bg-transparent border-b border-transparent hover:border-gold/20 focus:border-gold/40 outline-none text-[11px] font-serif text-stone-800 placeholder:text-stone-300 transition-colors"
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<"landing" | "catalog">("landing");

  if (view === "catalog") {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#f5f2ed] shadow-2xl relative overflow-x-hidden flex flex-col">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-200/40 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-light/20 rounded-full -ml-32 -mb-32 blur-3xl" />

        <header className="pt-12 pb-8 px-6 flex items-center justify-between relative z-10">
          <button 
            onClick={() => setView("landing")}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gold"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-xl font-serif text-stone-800">Catálogo</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="px-6 pb-20 space-y-10 relative z-10 flex-1">
          <div className="text-center space-y-2">
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-light">Explore nossa coleção exclusiva</p>
            <div className="w-12 h-0.5 bg-gold/40 mx-auto" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10">
            <CatalogItem id="cat1" />
            <CatalogItem id="cat2" />
            <CatalogItem id="cat3" />
            <CatalogItem id="cat4" />
            <CatalogItem id="cat5" />
            <CatalogItem id="cat6" />
            <CatalogItem id="cat7" />
            <CatalogItem id="cat8" />
            <CatalogItem id="cat9" />
            <CatalogItem id="cat10" />
            <CatalogItem id="cat11" />
            <CatalogItem id="cat12" />
            <CatalogItem id="cat13" />
            <CatalogItem id="cat14" />
            <CatalogItem id="cat15" />
            <CatalogItem id="cat16" />
            <CatalogItem id="cat17" />
            <CatalogItem id="cat18" />
            <CatalogItem id="cat19" />
            <CatalogItem id="cat20" />
          </div>

          <div className="pt-12 text-center">
            <p className="text-stone-400 text-xs font-light italic">Mais produtos em breve...</p>
          </div>
        </main>

        <footer className="p-6 relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a 
              href="https://wa.me/5548920025308?text=Ol%C3%A1%2C%20seja%20bem%20vindo(a)!!!%2C%20n%C3%A3o%20estamos%20dispon%C3%ADveis%20no%20momento%2C%20assim%20que%20poss%C3%ADvel%20entraremos%20em%20contato%0AObrigado"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-stone-800 text-stone-50 font-medium rounded-2xl shadow-xl flex items-center justify-center gap-3 tracking-wide no-underline"
            >
              <MessageCircle className="w-5 h-5 text-gold" />
              Encomendar via WhatsApp
            </a>
          </motion.div>
        </footer>
        
        <div className="h-2 bg-gradient-to-r from-gold/20 via-gold to-gold/20 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f5f2ed] shadow-2xl relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-stone-200/40 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-light/20 rounded-full -ml-32 -mb-32 blur-3xl" />

      {/* 1. TOPO */}
      <header className="pt-16 pb-12 px-6 text-center flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-56 h-56 rounded-full border border-gold/30 p-2 bg-white shadow-2xl flex items-center justify-center relative"
        >
          <div className="w-full h-full rounded-full border border-gold/10 flex flex-col items-center justify-center bg-stone-100/20 relative overflow-hidden">
            {/* Initials S B - Large, centered, gold, rounded font */}
            <div className="flex items-center justify-center -mt-4">
              <span className="text-7xl font-sans text-gold font-light tracking-tighter">S</span>
              <span className="text-7xl font-sans text-gold font-light tracking-tighter -ml-1">B</span>
            </div>
            
            {/* Brand Name - Inside, bottom, centered, smaller font */}
            <div className="absolute bottom-10 w-full text-center px-4">
              <span className="text-[11px] font-sans text-gold font-medium uppercase tracking-[0.3em]">
                Sabrina Bordados
              </span>
            </div>

            {/* Slogan - Also inside to comply with "all elements inside" */}
            <div className="absolute bottom-5 w-full text-center px-6">
              <p className="text-[8px] text-stone-400 font-light leading-tight">
                Bordados que transformam momentos em memórias 🤍
              </p>
            </div>
          </div>
          
          {/* Jewelry-like shine effect */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/40 blur-md rounded-full" />
        </motion.div>
      </header>

      <main className="px-6 pb-20 space-y-12 relative z-10">
        
        {/* 2. SEÇÃO DE DESTAQUE */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <ProductImage id="hero" aspect="aspect-[4/5]" label="Foto de Destaque" className="shadow-xl" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gold">
            <Heart className="w-6 h-6 fill-gold/10" />
          </div>
        </motion.section>

        {/* 3. SEÇÃO DE PRODUTOS (RESUMO) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-stone-700">Nossas Peças</h2>
            <div className="h-px flex-1 bg-gold-light/40 ml-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ProductImage id="p1" label="Produto 1" className="shadow-md" />
            <ProductImage id="p2" label="Produto 2" className="shadow-md" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <ProductImage id="p3" label="Detalhe 1" className="shadow-sm" />
            <ProductImage id="p4" label="Detalhe 2" className="shadow-sm" />
            <ProductImage id="p5" label="Detalhe 3" className="shadow-sm" />
          </div>
        </section>

        {/* 4. BOTÃO */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pt-2"
        >
          <button 
            onClick={() => setView("catalog")}
            className="w-full py-4 bg-white border border-gold/30 text-gold font-medium rounded-full shadow-sm flex items-center justify-center gap-2 tracking-wide uppercase text-xs"
          >
            Ver Catálogo Completo
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* 5. MAIS PRODUTOS (GRID) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-serif text-stone-800">Inspirações</h2>
            <p className="text-stone-400 text-xs font-light">Acompanhe nosso trabalho</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProductImage id="i1" label="Inspiração 1" className="shadow-sm" />
            <ProductImage id="i2" label="Inspiração 2" className="shadow-sm aspect-[3/4]" />
            <ProductImage id="i3" label="Inspiração 3" className="shadow-sm aspect-[3/4]" />
            <ProductImage id="i4" label="Inspiração 4" className="shadow-sm" />
            <ProductImage id="i5" label="Inspiração 5" className="shadow-sm" />
            <ProductImage id="i6" label="Inspiração 6" className="shadow-sm" />
          </div>
        </section>

        {/* 6. BOTÃO FINAL */}
        <footer className="pt-8 space-y-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <a 
              href="https://wa.me/5548920025308?text=Ol%C3%A1%2C%20seja%20bem%20vindo(a)!!!%2C%20n%C3%A3o%20estamos%20dispon%C3%ADveis%20no%20momento%2C%20assim%20que%20poss%C3%ADvel%20entraremos%20em%20contato%0AObrigado"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-stone-800 text-stone-50 font-medium rounded-2xl shadow-xl flex items-center justify-center gap-3 tracking-wide no-underline"
            >
              <MessageCircle className="w-6 h-6 text-gold" />
              Fazer pedido no WhatsApp
            </a>
          </motion.div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/ateliesabrinabordados?igsh=N2w0MWhqMWxscjBk" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-stone-600 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/5548920025308"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-stone-600 hover:text-gold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">
              © 2024 Ateliê Sabrina Bordados
            </p>
          </div>
        </footer>

      </main>

      {/* Bottom bar decorative */}
      <div className="h-2 bg-gradient-to-r from-gold/20 via-gold to-gold/20 w-full" />
    </div>
  );
}
