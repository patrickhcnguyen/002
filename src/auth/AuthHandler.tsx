import supabase from "@/lib/supabaseClient";

type AdminSignUpData = {
    email: string;
    password: string;
    username: string;
    branch: string;
}

export const signUp = async ({ email, password, username, branch }: AdminSignUpData) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    if (error) throw error;

    if (!data.user?.id) {
        throw new Error('User creation failed');
    }

    const { error: adminError } = await supabase
        .from('admins')
        .insert({
            id: data.user.id,  
            email,
            username,
            branch
        });

    if (adminError) {
        console.error('Admin insert error:', adminError);
        throw adminError;
    }

    return data;
}

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
}

export const AuthHandler = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session;
};