'use client';

import { useState, useEffect } from 'react';
import styles from './WebsiteComparison.module.css';

const WebsiteComparison = () => {
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      id: 'hero',
      title: 'Hero Section',
      subtitle: 'First impression that converts',
      custom: {
        code: `export const CustomHero = ({ 
  title = "Transform Your Business",
  subtitle = "Professional solutions...", 
  buttonText = "Get Started Today",
  theme = "modern",
  animations = true
}) => {
  return (
    <section className={\`hero-\${theme}\`}>
      <div className="container">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        <Button 
          variant={theme}
          size="lg"
          onClick={handleCustomAction}
          className="cta-button"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
};`,
        output: {
          title: "Transform Your Business",
          subtitle: "Professional solutions designed with precision, accessibility, and performance in mind",
          button: "Get Started Today",
          features: ["🎨 Custom animations", "⚡ Optimized performance", "📱 Perfect responsive"]
        }
      },
      template: {
        code: `<div class="hero-template">
  <h1>Welcome to Our Site</h1>
  <p>Generic description text</p>
  <button class="btn-blue">
    Click Here
  </button>
</div>

<style>
.hero-template {
  text-align: center;
  padding: 50px 20px;
}
.btn-blue {
  background: #007cba;
  color: white;
  padding: 10px 20px;
}
</style>`,
        output: {
          title: "Welcome to Our Site",
          subtitle: "Generic description text",
          button: "Click Here",
          limitations: ["❌ 3 color options", "❌ No animations", "❌ Basic layout only"]
        }
      }
    },
    {
      id: 'pricing',
      title: 'Pricing Strategy',
      subtitle: 'Built for your business model',
      custom: {
        code: `const CustomPricing = ({ 
  model = "tiered",
  currency = "USD",
  features = customFeatures,
  promotions = activePromos
}) => {
  const [selectedTier, setSelectedTier] = useState(1);
  
  return (
    <section className="pricing-section">
      {model === 'calculator' && (
        <PricingCalculator 
          variables={businessVariables}
          onCalculate={handleCustomPricing}
        />
      )}
      
      <div className="pricing-grid">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.id}
            {...tier}
            highlighted={index === selectedTier}
            customAnimations={true}
            onSelect={() => setSelectedTier(index)}
          />
        ))}
      </div>
      
      <PromoSection promos={promotions} />
    </section>
  );
};`,
        output: {
          plans: [
            { name: "Starter", price: "$29", desc: "Perfect for small projects", custom: true },
            { name: "Professional", price: "$99", desc: "For growing businesses", custom: true }
          ],
          features: ["🔧 Custom integrations", "📊 Advanced analytics", "💡 Any pricing model"]
        }
      },
      template: {
        code: `<div class="pricing-table">
  <div class="price-card">
    <h3>Basic</h3>
    <div class="price">$10/mo</div>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
    <button>Choose</button>
  </div>
  <div class="price-card">
    <h3>Pro</h3>
    <div class="price">$25/mo</div>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
    <button>Choose</button>
  </div>
</div>`,
        output: {
          plans: [
            { name: "Basic", price: "$10", desc: "Basic features", custom: false },
            { name: "Pro", price: "$25", desc: "More features", custom: false }
          ],
          limitations: ["⚠️ Only 3-column layout", "❌ No custom fields", "❌ Basic styling"]
        }
      }
    },
    {
      id: 'form',
      title: 'Contact Forms',
      subtitle: 'Tailored to your workflow',
      custom: {
        code: `const CustomForm = ({ 
  fields = ["name", "email", "project"],
  validation = customRules,
  integrations = ["salesforce", "hubspot"],
  analytics = true
}) => {
  const [formData, setFormData] = useState({});
  
  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {fields.map(field => (
        <FormField
          key={field}
          type={getFieldType(field)}
          validation={validation[field]}
          placeholder={getCustomPlaceholder(field)}
          onChange={(value) => updateField(field, value)}
          customStyling={brandTheme}
        />
      ))}
      
      <SubmitButton 
        loading={isSubmitting}
        successAnimation={true}
        analytics={analytics}
      >
        {getCustomButtonText()}
      </SubmitButton>
    </form>
  );
};`,
        output: {
          fields: [
            { label: "Email Address", type: "email", placeholder: "your@company.com" },
            { label: "Project Type", type: "select", options: ["E-commerce", "SaaS", "Custom App"] },
            { label: "Budget Range", type: "range", value: "$10k - $50k" }
          ],
          features: ["🔗 CRM Integration", "📊 Custom Analytics", "✅ Smart Validation"]
        }
      },
      template: {
        code: `<form class="contact-form">
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <textarea placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>

<style>
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
}
</style>`,
        output: {
          fields: [
            { label: "", type: "text", placeholder: "Name" },
            { label: "", type: "email", placeholder: "Email" },
            { label: "", type: "textarea", placeholder: "Message" }
          ],
          limitations: ["❌ No labels", "❌ Basic validation", "❌ No integrations"]
        }
      }
    }
  ];

  // Simple auto-advance every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [examples.length]);

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const currentData = examples[currentExample];

  const CustomOutput = ({ data }) => {
    if (currentData.id === 'hero') {
      return (
        <div className={styles.outputContent}>
          <div className={styles.heroOutput}>
            <h1 className={styles.heroTitle}>{data.output.title}</h1>
            <p className={styles.heroSubtitle}>{data.output.subtitle}</p>
            <button className={styles.heroButton}>{data.output.button}</button>
            <div className={styles.features}>
              {data.output.features?.map((feature, index) => (
                <span key={index} className={styles.featureTag}>{feature}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'pricing') {
      return (
        <div className={styles.outputContent}>
          <div className={styles.pricingOutput}>
            {data.output.plans?.map((plan, index) => (
              <div key={index} className={`${styles.pricingCard} ${data === currentData.custom ? styles.customCard : styles.templateCard}`}>
                <h3>{plan.name}</h3>
                <div className={styles.priceAmount}>{plan.price}</div>
                <p>{plan.desc}</p>
              </div>
            ))}
            <div className={styles.features}>
              {data.output.features?.map((feature, index) => (
                <span key={index} className={styles.featureTag}>{feature}</span>
              ))}
              {data.output.limitations?.map((limitation, index) => (
                <span key={index} className={styles.limitationTag}>{limitation}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'form') {
      return (
        <div className={styles.outputContent}>
          <div className={styles.formOutput}>
            {data.output.fields?.map((field, index) => (
              <div key={index} className={styles.formField}>
                {field.label && <label>{field.label}</label>}
                {field.type === 'select' ? (
                  <select>
                    {field.options?.map((option, i) => (
                      <option key={i}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea placeholder={field.placeholder} />
                ) : (
                  <input type={field.type} placeholder={field.placeholder} />
                )}
              </div>
            ))}
            <button className={data === currentData.custom ? styles.customSubmit : styles.templateSubmit}>
              {data === currentData.custom ? 'Start Your Project' : 'Submit'}
            </button>
            <div className={styles.features}>
              {data.output.features?.map((feature, index) => (
                <span key={index} className={styles.featureTag}>{feature}</span>
              ))}
              {data.output.limitations?.map((limitation, index) => (
                <span key={index} className={styles.limitationTag}>{limitation}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Website Development Comparison</h1>
          <p>Custom Code vs Template Solutions</p>
        </div>
        <div className={styles.navigation}>
          <button onClick={prevExample} className={styles.navButton}>
            <span>←</span>
          </button>
          <div className={styles.indicator}>
            <span className={styles.currentStep}>{currentExample + 1}</span>
            <span className={styles.totalSteps}>/ {examples.length}</span>
            <div className={styles.stepTitle}>{currentData.title}</div>
          </div>
          <button onClick={nextExample} className={styles.navButton}>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Custom Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.badge + ' ' + styles.customBadge}>CUSTOM CODE</div>
            <h3>{currentData.title}</h3>
            <p>{currentData.subtitle}</p>
          </div>
          
          <div className={styles.outputSection}>
            <div className={styles.sectionTitle}>
              <span className={styles.icon}>📱</span>
              Live Output
            </div>
            <div className={styles.outputFrame}>
              <CustomOutput data={currentData.custom} />
            </div>
          </div>

          <div className={styles.codeSection}>
            <div className={styles.sectionTitle}>
              <span className={styles.icon}>⚡</span>
              Source Code
            </div>
            <div className={styles.codeFrame}>
              <pre className={styles.code}>
                <code>{currentData.custom.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Template Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.badge + ' ' + styles.templateBadge}>TEMPLATE</div>
            <h3>{currentData.title}</h3>
            <p>Generic template approach</p>
          </div>
          
          <div className={styles.outputSection}>
            <div className={styles.sectionTitle}>
              <span className={styles.icon}>📱</span>
              Live Output
            </div>
            <div className={styles.outputFrame}>
              <CustomOutput data={currentData.template} />
            </div>
          </div>

          <div className={styles.codeSection}>
            <div className={styles.sectionTitle}>
              <span className={styles.icon}>⚠️</span>
              Source Code
            </div>
            <div className={styles.codeFrame}>
              <pre className={styles.code}>
                <code>{currentData.template.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.dots}>
          {examples.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentExample ? styles.activeDot : ''}`}
              onClick={() => setCurrentExample(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteComparison;