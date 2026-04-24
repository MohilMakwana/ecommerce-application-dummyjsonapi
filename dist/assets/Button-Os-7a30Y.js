import{t as e}from"./jsx-runtime-CZp7OW7F.js";var t=e(),n={primary:`bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-primary-600/30`,secondary:`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700`,danger:`bg-red-500 hover:bg-red-600 text-white`,ghost:`text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`,accent:`bg-accent hover:bg-accent-dark text-white shadow-sm hover:shadow-orange-400/30`},r={sm:`px-3 py-1.5 text-sm`,md:`px-5 py-2.5 text-sm`,lg:`px-7 py-3.5 text-base`,icon:`p-2`};function i({children:e,variant:i=`primary`,size:a=`md`,className:o=``,loading:s=!1,disabled:c=!1,fullWidth:l=!1,...u}){return(0,t.jsxs)(`button`,{disabled:c||s,className:`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${n[i]}
        ${r[a]}
        ${l?`w-full`:``}
        ${o}
      `,...u,children:[s&&(0,t.jsxs)(`svg`,{className:`animate-spin h-4 w-4`,fill:`none`,viewBox:`0 0 24 24`,children:[(0,t.jsx)(`circle`,{className:`opacity-25`,cx:`12`,cy:`12`,r:`10`,stroke:`currentColor`,strokeWidth:`4`}),(0,t.jsx)(`path`,{className:`opacity-75`,fill:`currentColor`,d:`M4 12a8 8 0 018-8v8H4z`})]}),e]})}export{i as t};