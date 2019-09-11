module Jekyll
  class EnvVars < Generator
    def generate(site)
      site.config['env'] = ENV.to_h
    end
  end
end
