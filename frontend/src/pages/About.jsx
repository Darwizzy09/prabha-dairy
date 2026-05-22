import React from 'react';
import { 
  History, Users, Store, Droplet, Home, Package, 
  Heart, Shield, Award, Crown, Star 
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 text-brand rounded-full mb-6 shadow-sm">
            <Crown size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Prabha Dairy</h1>
          
          {/* The Origin Journey */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg font-bold text-gray-500 max-w-3xl mx-auto">
            <span>A small grocery shop</span>
            <span className="hidden md:block text-brand">→</span>
            <span>Tel Bhandar</span>
            <span className="hidden md:block text-brand">→</span>
            <span className="text-brand-dark">Dairy</span>
          </div>
        </div>

        {/* SECTION 1: THE STORY */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-brand"></div>
          <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-6">
            <p>
              We started as a small grocery shop, from the grocery to Tel Bhandar. From Tel Bhandar, we started selling Ghee, the product was an instant hit.
            </p>
            <p>
              We then started adding Dairy products one by one, and here we are standing proudly for the last two and a half decades. As a business, our primary objective has always been to serve our customers and provide high-quality products. We are working for that purpose and still have a lot to catch up on. We hope to keep winning our customers' trust and build a lifelong relationship. We are constantly improving and trying to make the best quality products. We have been improving the standards in the dairy industry of Chhatrapati Sambhajinagar for the last decade, and we are upgrading our machinery and improving the experience of our customers. We are proud to say that we have been the living standard for the Dairy Industry in many ways for the last decade.
            </p>
          </div>
        </div>

        {/* SECTION 2: CURRENT SCALE & STATS */}
        <div className="mb-16">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Currently, we are a family of more than 30 members, and proud to say that we are expanding rapidly since our manpower has increased. We are currently selling our products throughout Chhatrapati Sambhajinagar. We have more than 300 live counters where our products are sold, and a self-owned retail store at M2 Road, TV Centre, Chhatrapati Sambhajinagar, Maharashtra, India. Our Daily Milk collection reaches up to 3000 ltr, and we are proud to say our products are consumed in over 10000+ homes where they are consumed, and our Ghee is used in the medical field as well. We currently manufacture more than 50 products.
            </p>
            
            {/* Visual Stats Grid based on the text */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/30 transition-colors">
                <Users className="mx-auto text-brand mb-3" size={28} />
                <p className="text-2xl font-black text-gray-900">30+</p>
                <p className="text-sm font-bold text-gray-500 mt-1">Family Members</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/30 transition-colors">
                <Store className="mx-auto text-brand mb-3" size={28} />
                <p className="text-2xl font-black text-gray-900">300+</p>
                <p className="text-sm font-bold text-gray-500 mt-1">Live Counters</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/30 transition-colors">
                <Droplet className="mx-auto text-brand mb-3" size={28} />
                <p className="text-2xl font-black text-gray-900">3000 L</p>
                <p className="text-sm font-bold text-gray-500 mt-1">Daily Collection</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/30 transition-colors">
                <Home className="mx-auto text-brand mb-3" size={28} />
                <p className="text-2xl font-black text-gray-900">10,000+</p>
                <p className="text-sm font-bold text-gray-500 mt-1">Homes Served monthly</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/30 transition-colors md:col-span-1 col-span-2">
                <Package className="mx-auto text-brand mb-3" size={28} />
                <p className="text-2xl font-black text-gray-900">50+</p>
                <p className="text-sm font-bold text-gray-500 mt-1">Products Made</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE VALUE QUOTE */}
        <div className="bg-brand-dark text-white rounded-[2.5rem] p-10 md:p-16 mb-20 text-center relative shadow-xl shadow-brand-dark/20">
          <Heart className="mx-auto text-brand mb-6" size={48} />
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-8 font-medium">
            Our biggest strength are our lovely customers, they are everything to us, we believe in the concept of
          </p>
          <blockquote className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            "ग्राहकाला दिलेली उत्तम सेवा हीच खरी ईश्वरी पूजा आहे."
          </blockquote>
          <p className="text-xl text-brand-light font-bold">
            That is why we try our best to improve our service and products.
          </p>
        </div>

        {/* SECTION 4: THE PEDESTAL & LEADERSHIP */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-black tracking-widest text-brand uppercase mb-4">The Foundation</h2>
          <h3 className="text-3xl font-black text-gray-900 mb-8">The Pedestal of Prabha Dairy</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-xl font-bold text-gray-600 bg-white px-12 py-6 rounded-full border border-gray-100 shadow-sm">
            <span>Shri. Kumudini Jairaj Sawalkar</span>
            <span className="hidden md:block text-gray-300">|</span>
            <span>Shri. Jairaj Sawalkar</span>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-block bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm mb-8">
             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Our Current COO</h4>
             <p className="text-xl font-black text-gray-900">Mr. Soham Rajesh Sawalkar</p>
          </div>
        </div>

        {/* SECTION 5: THE FOUNDERS */}
        <div className="space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Our Founders</h2>
          </div>

          {/* Founder 1 */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all duration-300">
            <div className="md:w-1/3 bg-gray-50 p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Star className="text-brand" size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Shri Rajesh Jairaj Sawalkar</h3>
              <p className="text-brand font-bold text-center">Founder</p>
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold uppercase rounded-full tracking-wider">Gau Rakshak</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">Social Worker</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">Director at Deogiri Bank</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">A social speaker</span>
              </div>
              <div className="prose text-gray-600 leading-relaxed space-y-4">
                <p>
                  The Man, The myth, The legend Sir Rajeshji is the founder of Prabha Dairy. He started doing Bussiness when he was just 20 years old, he had done many jobs before business, like carpentry, painting, welding, etc. But his Father Shri Jairaj Sawalkar always told him to start a bussiness due his belief in Rajesh ji, He started doing bussiness and no freinds life was not easy for him he started bussiness with his own hard earned money, first he started a carpentry bussiness with his friend when he was in college, the bussiness struggle in the starting day, but soon it got a good run, after that he started grocery store where the bussiness was located a little far from where it is today, the grocery store was a good start and a profitable bussiness where his younger brother joined him by helping through the bussiness, as the items and demand increased in grocery store he started a new product “Cow ghee” it was not manufactured, rather out sourced, as the demand increased the Dairy Products increased, and we are here today.
                </p>
                <p>
                  He is also a Gau Rakshak; he has saved over 1.00.000 cows and buffalo, and also saved some camels from being slaughtered illegally. He is dedicated to “Gau Seva”, and works hard to make a change in society to save cows from being slaughtered. He is a member of many NGOs and works with them to make society a better place for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all duration-300">
             <div className="md:w-1/3 bg-gray-50 p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 md:order-2">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Award className="text-brand" size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Shri Nilesh Jairaj Sawalkar</h3>
              <p className="text-brand font-bold text-center">Co-Founder</p>
            </div>
            <div className="md:w-2/3 p-8 md:p-12 md:order-1">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">Social Worker</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">Public Speaker</span>
              </div>
              <div className="prose text-gray-600 leading-relaxed space-y-4">
                <p>
                  The Man of the hour, Sir Nilesh ji, is the Co-Founder of The Prabha Dairy. He has over two decades of experience in food production and joined Sir Rajesh ji when he was in high school. After his arrival, the business got a boost as the manpower increased, and he has been the foundation in our production management, and most of our products are designed and executed by him. He is working hard to make our production better, and he is always in R&D to make our products better and of better quality. No matter the situation, making sure the customers are given the best and are satisfied is their main concern. 
                </p>
                <p className="font-bold text-gray-900 border-l-4 border-brand pl-4 my-6 py-2">
                  Sir Nilesh ji believes in "Seva Parmo Dharma", that is, serving is the highest duty, and he does that with his extreme hard work and dedication towards his work.
                </p>
                <p>
                  And that is his greatest motivation and will to keep working hard and give the people the food products they deserve. He is also a Social worker and a part of the Jain Community of Maharashtra. He is working very hard for the Jain community and is always there for society to help and make their life easier. He is a part of many NGOs and continues to manage work and social life side by side.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}