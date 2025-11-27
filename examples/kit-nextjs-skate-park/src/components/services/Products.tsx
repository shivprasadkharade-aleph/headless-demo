import React, {JSX} from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface ProductData {
  image?: string;
  price?: number | string;
  Price?: number | string;
  // [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  category: string;
  data: ProductData;
}

interface ProductsProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = async (props: ProductsProps): Promise<JSX.Element> => {
  const id = props.params.RenderingIdentifier;
  // Unique ID prevents conflicts if you put this component on a page twice
  const uniqueId = `inst-${Math.floor(Math.random() * 100000)}`;
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      'https://mp1bb1be6f936c8c1ac7.free.beeceptor.com/data',
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = await res.json();

    // Extract unique categories and sort them
    const catFromSitecore = props.params.Category.split('|').map(c => c.trim()).filter(c => c);
    //const categorySet = new Set(products.map(p => p.category));
    const categorySet = new Set(catFromSitecore);
    categories = Array.from(categorySet).sort();

  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
    console.error('Products API error:', err);
  }

  const getPrice = (data: ProductData): string => {
    const price = data.price ?? data.Price;
    if (!price) return 'Price on request';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `$${num.toFixed(2)}`;
  };

  // --- ROBUST FILTER SCRIPT ---
  // Uses Event Delegation to ensure it works immediately without refreshing
  const filterScript = `
    (function() {
      // Listen for changes globally on the document
      document.addEventListener('change', function(e) {
        
        // Only run logic if the changed element is one of OUR checkboxes
        if (e.target && e.target.classList.contains('chk-${uniqueId}')) {
          
          // 1. Get all checked boxes for this component
          var allCheckboxes = document.querySelectorAll('.chk-${uniqueId}');
          var checkedValues = [];
          allCheckboxes.forEach(function(cb) {
            if (cb.checked) checkedValues.push(cb.value);
          });

          // 2. Get all items and the counter
          var items = document.querySelectorAll('.itm-${uniqueId}');
          var countSpan = document.getElementById('cnt-${uniqueId}');
          var visibleCount = 0;

          // 3. Filter items
          items.forEach(function(item) {
            var cat = item.getAttribute('data-category');
            
            // Show if NOTHING is checked, OR if category matches
            var isVisible = checkedValues.length === 0 || checkedValues.includes(cat);

            if (isVisible) {
              item.style.display = 'flex';
              visibleCount++;
            } else {
              item.style.display = 'none';
            }
          });

          // 4. Update the counter text
          if (countSpan) countSpan.innerText = visibleCount;
        }
      });
    })();
  `;

  return (
    <div>
      <div style={{paddingBottom:30}} className="component-content">
        <h2>
          Product Catalog (<span id={`cnt-${uniqueId}`}>{products.length}</span> items)
        </h2>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {/* --- FACET CHECKBOXES --- */}
        {!error && (
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px', 
            border: '1px solid #eee'
          }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>
              Filter by Category
            </h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {categories.map((cat) => (
                <label 
                  key={cat} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    fontSize: '1.55rem',
                    padding: '4px 8px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                >
                  <input
                    type="checkbox"
                    value={cat}
                    className={`chk-${uniqueId}`} 
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* --- PRODUCT GRID --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`itm-${uniqueId}`}
              data-category={product.category}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: '#fff',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  fontSize: '0.75rem', 
                  padding: '4px 10px', 
                  backgroundColor: '#f0f4f8',
                  color: '#4a5568', 
                  borderRadius: '20px',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  {product.category}
                </span>

                <img
                  src={product.data.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />

                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', minHeight: '3rem', lineHeight: '1.4' }}>
                  {product.name}
                </h3>

                <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.3rem', margin: '0.5rem 0' }}>
                  {getPrice(product.data)}
                </div>
              </div>

              <div style={{ fontSize: '1.40rem', color: '#666', textAlign: 'left', marginTop: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.8rem' }}>
                {Object.entries(product.data)
                  .filter(([k]) => !['image', 'price', 'Price'].includes(k))
                  .slice(0, 4)
                  .map(([k, v]) => (
                    <div key={k} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{textTransform: 'capitalize'}}>{k}:</strong> 
                      <span style={{ marginLeft: '8px' }}>{String(v)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- INJECT SCRIPT --- */}
        <div dangerouslySetInnerHTML={{ __html: `<script>${filterScript}</script>` }} />
        
      </div>
    </div>
  );
};