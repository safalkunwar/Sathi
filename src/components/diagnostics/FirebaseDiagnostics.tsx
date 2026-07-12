import React from 'react';
import { app, auth, db, storage, messaging, firebaseConfig } from '../firebase';

export const FirebaseDiagnostics: React.FC = () => {
  const [info, setInfo] = React.useState<any>({});

  React.useEffect(() => {
    const run = async () => {
      const results: any = {
        firebaseConfig: {
          apiKey: firebaseConfig.apiKey ? 'present' : 'missing',
          authDomain: firebaseConfig.authDomain,
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket,
          messagingSenderId: firebaseConfig.messagingSenderId,
          appId: firebaseConfig.appId ? 'present' : 'missing',
        },
        services: {
          app: !!app,
          auth: !!auth,
          db: !!db,
          storage: !!storage,
          messaging: !!messaging,
        },
        authState: null,
        errors: [] as string[],
      };

      try {
        if (!app) {
          results.errors.push('Firebase app is not initialized');
        } else {
          results.appName = app.name;
        }

        if (auth) {
          try {
            const result = await new Promise((resolve, reject) => {
              const unsub = auth.onAuthStateChanged(
                (user) => resolve(user ? { uid: user.uid, email: user.email } : null),
                (err) => reject(err)
              );
              setTimeout(() => { unsub(); resolve('timeout'); }, 5000);
            });
            results.authState = result;
          } catch (err: any) {
            results.errors.push(`Auth error: ${err.message || err}`);
          }
        }

        if (db) {
          try {
            const testDoc = await import('../services/firestore').then(m => m.firestore.getDocument('__test__'));
            results.firestoreRead = testDoc ? 'success' : 'empty';
          } catch (err: any) {
            results.errors.push(`Firestore error: ${err.message || err}`);
          }
        }
      } catch (err: any) {
        results.errors.push(`Diagnostics error: ${err.message || err}`);
      }

      setInfo(results);
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1113] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Firebase Diagnostics</h1>
        
        <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Configuration</h2>
          <pre className="text-xs bg-black/20 p-4 rounded-xl overflow-auto">
            {JSON.stringify(info.firebaseConfig, null, 2)}
          </pre>
        </div>

        <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(info.services || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Auth State</h2>
          <pre className="text-xs bg-black/20 p-4 rounded-xl overflow-auto">
            {JSON.stringify(info.authState, null, 2)}
          </pre>
        </div>

        {info.errors?.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-red-400">Errors</h2>
            <ul className="space-y-2">
              {info.errors.map((err: string, idx: number) => (
                <li key={idx} className="text-sm text-red-300">{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
