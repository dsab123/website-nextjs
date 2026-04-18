import Head from 'next/head';

export default function LearnArabic() {
  return (
    <>
      <Head>
        <title key="original-title">Learn Arabic · تعلّم العربية</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 0 32px',
        }}
      >
        <iframe
          src="/learn-arabic/index.html"
          title="Learn Arabic"
          allow="autoplay; microphone"
          style={{
            width: '100%',
            maxWidth: 520,
            height: 'min(860px, calc(100vh - 120px))',
            border: '3px solid #3d2c2e',
            borderRadius: 24,
            boxShadow: '0 8px 0 #3d2c2e, 0 14px 30px rgba(61,44,46,0.2)',
            background: '#fbf3e4',
          }}
        />
      </div>
    </>
  );
}
