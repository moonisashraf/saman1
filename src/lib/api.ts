import { supabase } from './supabase';
import type { CreateProjectData, UpdateProjectData, Project, Asset, Template } from './types';

export const projectsApi = {
  async create(data: CreateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getById(id: string): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return project;
  },

  async list(): Promise<Project[]> {
    const { data: projects, error } = await supabase
      .from('projects')
      .select()
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return projects;
  }
};

export const assetsApi = {
  async upload(file: File): Promise<Asset> {
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const { data: asset, error: insertError } = await supabase
      .from('assets')
      .insert({
        name: file.name,
        type: file.type,
        url: publicUrl,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return asset;
  },

  async list(): Promise<Asset[]> {
    const { data: assets, error } = await supabase
      .from('assets')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return assets;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const templatesApi = {
  async list(includePremium = false): Promise<Template[]> {
    let query = supabase
      .from('templates')
      .select()
      .order('created_at', { ascending: false });

    if (!includePremium) {
      query = query.eq('is_premium', false);
    }

    const { data: templates, error } = await query;

    if (error) throw error;
    return templates;
  },

  async getById(id: string): Promise<Template> {
    const { data: template, error } = await supabase
      .from('templates')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return template;
  }
};