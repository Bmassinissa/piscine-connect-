/*
    ******************************************************************************
    * Le script SDK propre à notre base de données Firestore généré par Firebase *
    ******************************************************************************
     
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/8.3.0/firebase-analytics.js"></script>

    <script>
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyBMP189erP8F7EVbDHlNrQbXmYKcnMUowI",
        authDomain: "piscineconnectee-8ac87.firebaseapp.com",
        projectId: "piscineconnectee-8ac87",
        storageBucket: "piscineconnectee-8ac87.appspot.com",
        messagingSenderId: "168684260012",
        appId: "1:168684260012:web:2b23da940edc6e32c72d09",
        measurementId: "G-EJQDL9VDW1"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    </script>

*/

/***************************************   FIN  DE LA PARTIE SDK   ********************************************* */

/****************************************** Récupéré sur Internet ***************************************/
/*Ce code sert à inclure des produits Firebase spécifiques 
Firebas e App (the core Firebase SDK) is always required and must be listed first*/

/******************************************* FIN Récupéré sur Internet  **********************************/







/*
    Chargement du fichier JSon contenant la clé 
    d'accès à notre Firebase: serviceAccountKey.json

    et Initialisation de notre propre serveur.
*/
const admin= require ("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const async = require("async");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/********************************** AJOUT DE DONNEES *********************************************
 *   Ajouter des données Cloud Firestore stocke les données dans des documents,                  *
 *   qui sont stockés dans des collections. Cloud Firestore crée des collections                 *
 *  et des documents implicitement la première fois que vous ajoutez des données                 *
 *   au document. Vous n'avez pas besoin de créer explicitement des collections ou des documents.*
 *   Créez une nouvelle collection et un document à l'aide de l'exemple de code suivant.         *
*************************************************************************************************/


/*
    Création d'une collection "luminosite" où y seront
    stockées les différentes valeurs "analogiques" de 
    luminosité, récupérées en temps réel.

module.exports.registerSensor = async function(valeurLuminosite)
{
    const docRef = db.collection(collectionPath, 'luminosite').doc(valeurLuminosite);
    const luminosite = 
    {
        /* 
            Nos données relatives à une entité "lumiere". Pour chaque valeur analogique,
            de lumiere récupérée, on lui associe la date de récupération (pour l'instant!)
        
        valeurLuminosite: valeurLuminosite,
        date: Date.now(),
    }


    /*
        FACULTATIF?
        On stocke la collection "luminosite" dans un document.
    
    await docRef.get().then(( DocumentSnapshot ) => {
        if(!DocumentSnapshot.exists)
            docRef.set(luminosite);
        else    
            docRef.update(luminosite);
    })

}*/

/*
    Les échantillons récupérés sont enregistrés en temps réel
    avec la date de récupération associée.
*/

module.exports.registerSample = async function (name, sample)
{
    /*TODO: vérifier la syntaxe: (collectionPath, 'luminosite')*/
    const docRef = db.collection('capteurs').doc(name).collection('samples').doc(Date.now().toString());

    const data =
    {
        value: sample,
        date: Date.now(),
    }
    await docRef.set(data);
}





