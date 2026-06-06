const NotFoundPages = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-8xl font-extrabold text-green-600">404</h1>

      <h2 className="mt-4 text-3xl font-bold text-gray-800">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-500 text-center max-w-md">
        Halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
      >
        
      </a>
    </div>
  );
};

export default NotFoundPages;