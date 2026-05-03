import React, { useState } from 'react';

function Contact({ data }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:5001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Show success message for 5 seconds
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus(`error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(`error: Could not connect to server at localhost:5001. Make sure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-12">
          Get in Touch
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-base font-black text-gray-900 mb-8 uppercase tracking-wide">Contact Information</p>
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Email</p>
                <a href={`mailto:${data.email}`} className="text-base text-gray-900 hover:text-gray-600">
                  {data.email}
                </a>
              </div>
              <div className="border-b border-gray-200 pb-8">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Phone</p>
                <a href={`tel:${data.phone}`} className="text-base text-gray-900 hover:text-gray-600">
                  {data.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">LinkedIn</p>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-base text-gray-900 hover:text-gray-600">
                  Connect with me
                </a>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 transition flex items-center gap-1">
                    Instagram <span aria-hidden="true">↗</span>
                  </a>
                  <a href={`mailto:${data.email}`} className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
                    Email <span aria-hidden="true">↗</span>
                  </a>
                  <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
                    Linkedin <span aria-hidden="true">↗</span>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
                    x (Twitter) <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black py-4 uppercase tracking-wider hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            
            {/* Status Messages */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}
            {status.startsWith('error') && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {status.replace('error: ', '')}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
