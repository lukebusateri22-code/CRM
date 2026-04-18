import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Wand2 } from 'lucide-react';

interface AIEmailComposerProps {
  recipientName?: string;
  context?: string;
  onSend?: (email: { subject: string; body: string }) => void;
}

function AIEmailComposer({ recipientName = 'Client', context = 'follow-up', onSend }: AIEmailComposerProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'urgent'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const emails = {
        professional: {
          subject: `Following Up: Growth Strategy Discussion with ${recipientName}`,
          body: `Dear ${recipientName},

I hope this email finds you well. I wanted to follow up on our recent conversation regarding your business growth strategy.

Based on our discussion, I believe our comprehensive growth consulting package would be an excellent fit for your needs. Our approach focuses on:

• Revenue optimization and scaling strategies
• Operational efficiency improvements
• Market expansion opportunities
• Data-driven decision making

I'd love to schedule a brief call this week to discuss how we can help you achieve your growth objectives. Would Tuesday or Thursday afternoon work for your schedule?

Looking forward to hearing from you.

Best regards,
Your Growth Consultant`
        },
        friendly: {
          subject: `Hey ${recipientName} - Let's Chat About Growing Your Business! 🚀`,
          body: `Hi ${recipientName}!

Hope you're having a great week! I've been thinking about our last conversation and I'm really excited about the potential we discussed.

I put together some ideas on how we could help take your business to the next level:

✨ Boost your revenue with proven strategies
✨ Streamline operations to save time and money
✨ Identify new growth opportunities
✨ Make smarter decisions with data

Want to hop on a quick call this week? I'd love to walk you through some specific ideas tailored to your business. Coffee's on me! ☕

Let me know what works for you!

Cheers,
Your Growth Partner`
        },
        urgent: {
          subject: `URGENT: Time-Sensitive Opportunity for ${recipientName}`,
          body: `${recipientName},

I'm reaching out with an urgent matter that requires your immediate attention.

We've identified a critical growth opportunity that's time-sensitive and could significantly impact your Q2 results. Based on current market conditions and your business trajectory, acting within the next 48 hours is essential.

Key points:
• Limited-time strategic advantage
• Potential 30-40% revenue increase
• Competitive positioning opportunity
• Resources available now

Can we schedule an emergency call today or tomorrow morning? This opportunity won't wait, and I want to ensure you don't miss out.

Please respond ASAP.

Urgently,
Your Growth Consultant`
        }
      };

      const selectedEmail = emails[tone];
      setSubject(selectedEmail.subject);
      setBody(selectedEmail.body);
      setIsGenerating(false);
    }, 1500);
  };

  const enhanceText = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setBody(body + '\n\nP.S. Our AI suggests mentioning: "We\'ve helped similar businesses in your industry achieve 40% growth in 6 months."');
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Email Composer</h2>
        </div>
        <span className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Tone
          </label>
          <div className="flex gap-2">
            {(['professional', 'friendly', 'urgent'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tone === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateEmail}
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Email
            </>
          )}
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Body
            </label>
            <button
              onClick={enhanceText}
              disabled={!body || isGenerating}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              AI Enhance
            </button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body will appear here..."
            rows={12}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSend?.({ subject, body })}
            disabled={!subject || !body}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
          <button
            onClick={() => { setSubject(''); setBody(''); }}
            className="px-4 py-2 border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>AI Tip:</strong> The AI analyzes your recipient's engagement history, deal stage, and industry to craft personalized emails with higher response rates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIEmailComposer;
