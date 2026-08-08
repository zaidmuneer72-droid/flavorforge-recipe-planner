import { Search, Calendar, ShoppingBag, Heart, Utensils } from 'lucide-react';

function NavItem({ id, label, Icon, active, onClick, badge }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none ${
        active
          ? 'bg-slate-700 text-white'
          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
      }`}
      aria-pressed={active}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
      {typeof badge === 'number' && (
        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-600 text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Navbar({ activeTab, setActiveTab, plannerCount = 0, shoppingCount = 0 }) {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-rose-600 p-1 rounded-md">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">FlavorForge</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-2">
            <NavItem
              id="explore"
              label="Explore Recipes"
              Icon={Search}
              active={activeTab === 'explore'}
              onClick={setActiveTab}
            />
            <NavItem
              id="planner"
              label="Weekly Planner"
              Icon={Calendar}
              active={activeTab === 'planner'}
              onClick={setActiveTab}
              badge={plannerCount}
            />
            <NavItem
              id="shopping"
              label="Shopping List"
              Icon={ShoppingBag}
              active={activeTab === 'shopping'}
              onClick={setActiveTab}
              badge={shoppingCount}
            />
            <NavItem
              id="favorites"
              label="Favorites"
              Icon={Heart}
              active={activeTab === 'favorites'}
              onClick={setActiveTab}
            />
          </nav>

          <div className="flex items-center sm:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('explore')}
                className={`p-2 rounded-md ${activeTab === 'explore' ? 'bg-slate-700 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
                aria-label="Explore"
              >
                <Search className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setActiveTab('planner')}
                  className={`p-2 rounded-md ${activeTab === 'planner' ? 'bg-slate-700 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
                  aria-label="Planner"
                >
                  <Calendar className="w-5 h-5" />
                </button>
                {plannerCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-rose-600 text-white">
                    {plannerCount}
                  </span>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveTab('shopping')}
                  className={`p-2 rounded-md ${activeTab === 'shopping' ? 'bg-slate-700 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
                  aria-label="Shopping"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                {shoppingCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-rose-600 text-white">
                    {shoppingCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`p-2 rounded-md ${activeTab === 'favorites' ? 'bg-slate-700 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
