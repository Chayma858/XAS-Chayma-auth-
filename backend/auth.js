import supabase from './config.js' ;

document.addEventListener('DOMContentLoaded',()=>{
    //verification du password 
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const isValid = checkPassStrength(password);
            
            // Remove all classes
            strengthFill.className = 'strength-bar-fill';
            
            // Update based on length
            if (password.length === 0) {
                strengthText.textContent = 'Password strength';
                strengthText.style.color = '#666';
            } else if (isValid) {
                strengthFill.classList.add('strong');
                strengthText.textContent = '✅ Valid password';
                strengthText.style.color = '#00cc66';
            } else {
                strengthFill.classList.add('weak');
                strengthText.textContent = '❌ At least 8 characters required';
                strengthText.style.color = '#ff4444';
            }
        });
    }


    //sign up form 
    const signUpForm = document.getElementById('signup');
    if (!signUpForm) {
        console.error('Form not found!');
        return;
    }
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const Name =document.getElementById('Name').value;
        const email = document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const userType=document.querySelector('input[name="userType"]:checked').value;
        if(!email || !password || !Name){
            alert('Please fill all fields');
            return;
        }

        console.log('Form submitted:', { Name, email, password ,userType});

        try {
            const isValid = checkPassStrength(password);
            if (isValid){
            const hashpassword =await hashPassword(password);
            const { data, error } = await supabase
                .from('client')
                .insert([{ Name: Name, email: email ,password:hashpassword,userType:userType}])
                .select();
            
            console.log('Response:', { data, error });
            
            if (error) {
                console.error('Supabase Error:', error);
                alert('Erreur: ' + error.message);
            } else {
                console.log('Data inserted successfully:', data);
                alert('Inscription réussie!')
                if(userType=='student'){window.location.assign('/frontend/etudiant.html');}
                else{window.location.assign('/frontend/professeur.html');}
                signUpForm.reset();
            }}else{alert('password is weak bro !! ');}
        } catch (err) {
            console.error('Error:', err);
            alert('Erreur lors de l\'inscription: ' + err.message);
        }

    });

    //sign in form
    const signInForm = document.getElementById('signin');
    if(!signInForm){
        console.error("Form not found");
    }
    signInForm.addEventListener('submit', async(e)=> {
        e.preventDefault();
        const email=document.getElementById('signin-email').value;
        const password=document.getElementById('signin-password').value;
        const hashPass=await hashPassword(password);
        const {data , error}=await supabase 
            .from('client')
            .select()
            .eq('email' ,email) ; 
        if (error) {
            console.error('Supabase Error:', error);
            alert('Erreur: ' + error.message);
        } else {
            if(data.length === 0 ){
                console.error('email not found ');
                alert('Sign in failed : email not found');
            }
            else {
                if (data[0].password !== hashPass ){
                    console.error('password incorrecte');
                    alert('Sign in failed : password incorrecte ');
                }
                else {
                    console.log('Data inserted successfully:', data);
                    alert('Sign In réussie!');
                    if(data[0].userType=='student'){window.location.assign('/frontend/etudiant.html');}
                    else{
                        if(data[0].userType=='Admin'){
                            window.location.assign('/frontend/admin.html');
                        }
                        else{window.location.assign('/frontend/professeur.html');}}
                    signInForm.reset();
                }
            }
        }
    });
} ) ;
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
function checkPassStrength (password){
    return password.length >=8 ;
}