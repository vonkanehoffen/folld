class LinksController < ApplicationController

  respond_to :html, :js
  before_filter :authenticate_user!, except: [:index, :show]
  
  # GET /links
  def index
    # TODO: Get friendly URLs on search results:
    # http://stackoverflow.com/questions/8528288/submitting-a-rails-form-to-a-friendly-url
    # Maybe switch to rocket tag too. for easier multiple tag searches
    # https://github.com/bradphelan/rocket_tag
    if params[:username] && params[:tag]
      @links = User.find_by_username(params[:username]).links.tagged_with(params[:tag]).order('updated_at desc').page params[:page]
    elsif params[:username]
      @links = User.find_by_username(params[:username]).links.order('updated_at desc').page params[:page]
    elsif params[:tag] && !params[:tag].empty?
      @links = Link.tagged_with(params[:tag]).page params[:page]
    else
      @links = Link.order('updated_at desc').includes(:user).page params[:page]
    end
    respond_with(@links)
  end

  def show
    @link = Link.find(params[:id])
    respond_with(@link)
  end

  # GET /links/new
  def new
    @link = Link.new
    respond_with(@link)
  end

  # GET /links/1/edit
  def edit
    @link = Link.find(params[:id])
    respond_with(@link)
  end

  # POST /links
  def create
    @link = Link.new(params[:link])
    @link.user = current_user

    if @link.save
      flash[:notice] = 'Link created.'
    end
    respond_with(@link)
  end

  # PUT /links/1
  def update
    @link = Link.find(params[:id])
    if @link.user == current_user
      if @link.update_attributes(params[:link])
        flash[:notice] = 'Link updated.'
      end
    else
      flash[:error] = "You can't update other people's links"
    end
    respond_with(@link)
  end

  # DELETE /links/1
  def destroy
    @link = Link.find(params[:id])
    if @link.user == current_user
      @link.destroy
      flash[:notice] = 'Link deleted.'
      @destroyed = true
    else
      flash[:error] = "You can't delete other people's links"
    end
    respond_with(@link)
  end
end
